import { from, of } from "rxjs";
import { distinct, map, mergeMap, retry, scan, take } from "rxjs/operators";
// @ts-ignore
import maxSatisfying from "semver/ranges/max-satisfying";
import { getPackageInfo } from "utils/getPackageInfo";
import { semverCompare } from "utils/semverCompare";
import fetchPackage, {
  FetchResult,
  isAllVersionPackageMetaData,
} from "./fetchPackage";
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
  packageVersionRange?: string,
) =>
  // get all versions if packageVersion exists, if not just get latest
  of(
    `${packageName}${
      // check if packageName has "/" eg. @angular/core
      packageVersionRange || packageName.includes("/") ? `` : `/${latestTag}`
    }`,
  ).pipe(
    mergeMap(fetchPackage),
    // retry 2 times if fail
    retry(2),
  );

// use semver with packageVersionRange to get the max satisfying version
// if there is no such version, use latest tag version
// then use that version to get the correct dependencies
const getDependenciesFromFetchResult = (
  packageName: string,
  packageVersionRange?: string,
) => (packageData: FetchResult) => {
  if (isAllVersionPackageMetaData(packageData)) {
    if (packageVersionRange) {
      const maxVersion = maxSatisfying(
        Object.keys(packageData.versions),
        packageVersionRange,
      );
      if (maxVersion) {
        return getDependenciesInSet(
          packageData.versions[maxVersion][dependenciesField],
        );
      }
      // eslint-disable-next-line no-console
      console.warn(
        `no such version ${packageVersionRange} for ${packageName}, use latest tag`,
      );
    }
    const latestVersion = packageData[distributionTags][latestTag];
    const latestVersionMeta = packageData.versions[latestVersion];
    if (latestVersionMeta) {
      return getDependenciesInSet(latestVersionMeta[dependenciesField]);
    }
    console.warn(`no latest version for ${packageName}`); // eslint-disable-line no-console
    return new Set<string>();
  }
  return getDependenciesInSet(packageData[dependenciesField]);
};

// Observable that returns all the dependencies for one package in `package@version` format
const getDependencies$ = (packageName: string, packageVersionRange?: string) =>
  retryFetchPackage$(packageName, packageVersionRange).pipe(
    map(getDependenciesFromFetchResult(packageName, packageVersionRange)),
    // convert from Set to Stream
    mergeMap(dependenciesInSet => from(dependenciesInSet)),
  );

const getMaxVersionFromFetchResult = (
  packageName: string,
  packageVersionRange: string,
) => (packageData: FetchResult) => {
  if (isAllVersionPackageMetaData(packageData)) {
    const maxVersion =
      maxSatisfying(Object.keys(packageData.versions), packageVersionRange) ||
      packageVersionRange;
    return `${packageName}@${maxVersion}`;
  }
  return `${packageName}@${packageVersionRange}`;
};

// Observable that get all dependencies for the package recursively
export const getAllDependencies$ = (
  packageString: string,
  showDifferentVersion: boolean,
  concurrency: number,
  packageVersion?: string,
) => {
  return getDependencies$(packageString, packageVersion).pipe(
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
        map(getMaxVersionFromFetchResult(packageName, packageVersionRange)),
      );
    }, concurrency),
    // only show distinct value
    distinct(),
    // get maximum 1000 packages, one good example is bloater
    take(1000),
    scan((acc: string[], value: string) => [...acc, value], []),
    map(value => value.sort()),
  );
};

export const getAllVersions$ = (packageString: string) => {
  return retryFetchPackage$(packageString, "all").pipe(
    map(packageData => {
      if (isAllVersionPackageMetaData(packageData)) {
        return {
          versions: Object.keys(packageData.versions).sort(semverCompare),
          latest: packageData[distributionTags][latestTag],
        } as PackageVersionInfo;
      }
      throw new Error("couldn't find all versions package.json");
    }),
  );
};

export const getAllVersionsAsync = (packageString: string) => {
  return getAllVersions$(packageString).toPromise();
};
