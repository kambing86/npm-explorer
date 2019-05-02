import { from, of, empty } from "rxjs";
import {
  mergeMap,
  retry,
  distinct,
  expand,
  take,
  toArray
} from "rxjs/operators";
import { forIn } from "lodash";
import semver from "semver";
import fetchPackage from "../utils/fetchPackage";
import { getPackageInfo } from "../utils/getPackageInfo";

const dependenciesField = "dependencies";

// convert dependencies Object to Set with `package@version` format
const getDependenciesInSet = (dependencies: { [key: string]: string }) => {
  const results = new Set();
  forIn(dependencies, (value, key) => {
    results.add(`${key}@${value}`);
  });
  return results;
};

// Observable to get package data from registry cache or online registry
const retryFetchPackage$ = (packageName: string, packageVersion?: string) =>
  // get all versions if packageVersion exists, if not just get latest
  of(
    `${packageName}${
      packageVersion || packageName.includes("/") ? `` : "/latest"
    }`
  ).pipe(
    mergeMap(fetchPackage),
    // retry 2 times if fail
    retry(2)
  );

// Observable that returns all the dependencies for one package in `package@version` format
const getDependencies$ = (packageName: string, packageVersion?: string) =>
  retryFetchPackage$(packageName, packageVersion).pipe(
    // check if the packageVersion is in dist-tags or version
    // if so get the dependencies from there
    // else assume that packageVersion is a range and use semver to check
    // and get the max satisfying version
    mergeMap(async data => {
      if (data.versions) {
        const checkVersion = packageVersion || "latest";
        const versionInDistTags = data["dist-tags"][checkVersion];
        const foundVersion =
          data.versions[checkVersion] || data.versions[versionInDistTags];
        if (foundVersion) {
          return getDependenciesInSet(foundVersion[dependenciesField]);
        } else {
          const nearestVersion = semver.maxSatisfying(
            Object.keys(data.versions),
            checkVersion
          );
          if (!nearestVersion) {
            console.warn(`no such version ${checkVersion} for ${packageName}`);
            return [];
          }
          return getDependenciesInSet(
            data.versions[nearestVersion][dependenciesField]
          );
        }
      }
      return getDependenciesInSet(data[dependenciesField]);
    }),
    // convert from Set to Stream
    mergeMap(dependenciesInSet => from(dependenciesInSet))
  );

// Observable that get all dependencies for the package recursively
export const getAllDependencies$ = (
  packageString: string,
  showDifferentVersion: boolean = true,
  concurrency: number = 10
) => {
  // use Set to remove circular dependency, one good example is jest
  const checkedSet = new Set<string>();
  return getDependencies$(packageString).pipe(
    // get the dependencies of dependency, with 10 concurrency
    expand(dependency => {
      // if checked the same dependency before, return empty
      if (checkedSet.has(dependency)) {
        return empty();
      }
      checkedSet.add(dependency);
      const { packageName, packageVersion } = getPackageInfo(dependency);
      return getDependencies$(packageName, packageVersion);
    }, concurrency),
    // get the version number based on showDifferentVersion
    mergeMap(async (value: string) => {
      const data = getPackageInfo(value);
      if (!showDifferentVersion) {
        return data.packageName;
      }
      const packageData = await fetchPackage(data.packageName).toPromise();
      const maxVersion =
        semver.maxSatisfying(
          Object.keys(packageData.versions),
          data.packageVersion
        ) || data.packageVersion;
      return `${data.packageName}@${maxVersion}`;
    }, concurrency),
    // only show distinct value
    distinct(),
    // get maximum 1000 packages, one good example is bloater
    take(1000),
    toArray()
  );
};
