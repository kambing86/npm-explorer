import { Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { finalize, mergeMap, share } from "rxjs/operators";

const registryUrl = "https://npm-proxy.glitch.me/registry/";
// backup url
// const registryUrl = "https://registry.npmjs.cf/";

interface PackageMetaData {
  name: string;
  dependencies?: {
    [key: string]: string;
  };
}

interface AllVersionsPackageMetaData {
  "dist-tags": {
    [key: string]: string;
  };
  versions: {
    [key: string]: PackageMetaData;
  };
}

export type FetchResult = PackageMetaData | AllVersionsPackageMetaData;

const registryCache: { [key: string]: Observable<FetchResult> } = {};

export function isAllVersionPackageMetaData(
  result: FetchResult,
): result is AllVersionsPackageMetaData {
  return Boolean((result as AllVersionsPackageMetaData).versions);
}

// will get from cache and share the same Observable if still in fetching
const fetchPackage = (packageQuery: string): Observable<FetchResult> => {
  let cache = registryCache[packageQuery];
  if (!cache) {
    cache = registryCache[packageQuery] = fromFetch(
      `${registryUrl}${packageQuery}`,
    ).pipe(
      mergeMap((res: Response) => res.json()),
      finalize(() => {
        delete registryCache[packageQuery];
      }),
      share(),
    );
  }
  return cache;
};

export default fetchPackage;
