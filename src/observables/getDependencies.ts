import { from, of } from "rxjs";
import { distinct, map, mergeMap, retry, scan, take } from "rxjs/operators";
import semver from "semver";
import { getPackageInfo } from "../utils/getPackageInfo";
import fetchPackage, { isAllVersionPackageMetaData } from "./fetchPackage";
import { distinctExpand } from "./operators";

const dependenciesField = "dependencies";
const distributionTags = "dist-tags";
const latestTag = "latest";

// convert dependencies Object to Set with `package@version` format
const getDependenciesInSet = (dependencies?: { [key: string]: string }) => {
  const results = new Set<string>();
  if (dependencies === undefined) {
    return results;
  }
  for (const [key, value] of Object.entries(dependencies)) {
    results.add(`${key}@${value}`);
  }
  return results;
};

// Observable to get package data from registry cache or online registry
const retryFetchPackage$ = (
  packageName: string,
  packageVersionRange?: string
) =>
  // get all versions if packageVersion exists, if not just get latest
  of(
    `${packageName}${
      // check if packageName has "/" eg. @angular/core
      packageVersionRange || packageName.includes("/") ? `` : `/${latestTag}`
    }`
  ).pipe(
    mergeMap(fetchPackage),
    // retry 2 times if fail
    retry(2)
  );

// Observable that returns all the dependencies for one package in `package@version` format
const getDependencies$ = (packageName: string, packageVersionRange?: string) =>
  retryFetchPackage$(packageName, packageVersionRange).pipe(
    // use semver with packageVersionRange to get the max satisfying version
    // if there is no such version, use latest tag version
    map(data => {
      if (isAllVersionPackageMetaData(data)) {
        if (packageVersionRange) {
          const maxVersion = semver.maxSatisfying(
            Object.keys(data.versions),
            packageVersionRange
          );
          if (maxVersion) {
            return getDependenciesInSet(
              data.versions[maxVersion][dependenciesField]
            );
          }
          // eslint-disable-next-line no-console
          console.warn(
            `no such version ${packageVersionRange} for ${packageName}, use latest tag`
          );
        }
        const latestVersion = data[distributionTags][latestTag];
        const latestVersionMeta = data.versions[latestVersion];
        if (latestVersionMeta) {
          return getDependenciesInSet(latestVersionMeta[dependenciesField]);
        }
        console.warn(`no latest version for ${packageName}`); // eslint-disable-line no-console
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
  showDifferentVersion = true,
  concurrency = 10
) => {
  return getDependencies$(packageString).pipe(
    // get the dependencies of dependency, with 10 concurrency
    distinctExpand(dependency => {
      const { packageName, packageVersionRange } = getPackageInfo(dependency);
      return getDependencies$(packageName, packageVersionRange);
    }, concurrency),
    // get the version number based on showDifferentVersion
    mergeMap(value => {
      const { packageName, packageVersionRange } = getPackageInfo(value);
      if (!showDifferentVersion) {
        return of(packageName);
      }
      return retryFetchPackage$(packageName, packageVersionRange).pipe(
        map(packageData => {
          if (isAllVersionPackageMetaData(packageData)) {
            const maxVersion =
              semver.maxSatisfying(
                Object.keys(packageData.versions),
                packageVersionRange
              ) || packageVersionRange;
            return `${packageName}@${maxVersion}`;
          }
          return `${packageName}@${packageVersionRange}`;
        })
      );
    }, concurrency),
    // only show distinct value
    distinct(),
    // get maximum 1000 packages, one good example is bloater
    take(1000),
    scan((acc: string[], value: string) => [...acc, value], []),
    map(value => value.sort())
  );
};
