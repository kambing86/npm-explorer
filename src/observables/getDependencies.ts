import { forIn, isEmpty } from "lodash";
import { from, of } from "rxjs";
import {
  distinct,
  filter,
  map,
  mergeMap,
  retry,
  scan,
  take,
} from "rxjs/operators";
import semver from "semver";
import { getPackageInfo } from "../utils/getPackageInfo";
import fetchPackage, { isAllVersionPackageMetaData } from "./fetchPackage";
import { distinctExpand } from "./operators";

const dependenciesField = "dependencies";
const distributionTags = "dist-tags";
const latestTag = "latest";

// convert dependencies Object to Set with `package@version` format
const getDependenciesInSet = (dependencies: { [key: string]: string }) => {
  const results = new Set<string>();
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
      // check if packageName has "/" eg. @angular/core
      packageVersion || packageName.includes("/") ? `` : `/${latestTag}`
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
    map(data => {
      if (isAllVersionPackageMetaData(data)) {
        const checkVersion = packageVersion || latestTag;
        const versionInDistTags = data[distributionTags][checkVersion];
        const foundVersionMeta =
          data.versions[checkVersion] || data.versions[versionInDistTags];
        if (foundVersionMeta) {
          return getDependenciesInSet(foundVersionMeta[dependenciesField]);
        }
        const nearestVersion = semver.maxSatisfying(
          Object.keys(data.versions),
          checkVersion
        );
        if (nearestVersion) {
          return getDependenciesInSet(
            data.versions[nearestVersion][dependenciesField]
          );
        }
        // eslint-disable-next-line no-console
        console.warn(
          `no such version ${checkVersion} for ${packageName}, use latest tag`
        );
        const latestVersion = data[distributionTags][latestTag];
        const latestVersionMeta = data.versions[latestVersion];
        if (latestVersionMeta) {
          return getDependenciesInSet(latestVersionMeta[dependenciesField]);
        }
        console.warn("no latest version"); // eslint-disable-line no-console
        return new Set<string>();
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
  return getDependencies$(packageString).pipe(
    // get the dependencies of dependency, with 10 concurrency
    distinctExpand(dependency => {
      const { packageName, packageVersion } = getPackageInfo(dependency);
      return getDependencies$(packageName, packageVersion);
    }, concurrency),
    // get the version number based on showDifferentVersion
    mergeMap(value => {
      const { packageName, packageVersion } = getPackageInfo(value);
      if (!showDifferentVersion) {
        return of(packageName);
      }
      return retryFetchPackage$(packageName, packageVersion).pipe(
        map(packageData => {
          if (isAllVersionPackageMetaData(packageData)) {
            const maxVersion =
              semver.maxSatisfying(
                Object.keys(packageData.versions),
                packageVersion
              ) || packageVersion;
            return `${packageName}@${maxVersion}`;
          }
          return "";
        }),
        filter(value => !isEmpty(value))
      );
    }, concurrency),
    // only show distinct value
    distinct(),
    // get maximum 1000 packages, one good example is bloater
    take(1000),
    scan((acc: string[], value: string) => [...acc, value], [])
  );
};
