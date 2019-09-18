import { Observable } from "rxjs";
import { finalize, flatMap, share } from "rxjs/operators";
import { fromFetch } from "./fetch";

const registryUrl = "https://npm-registry-proxy.glitch.me/";
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

type FetchResult = PackageMetaData | AllVersionsPackageMetaData;

const registryCache: { [key: string]: Observable<FetchResult> } = {};

export function isAllVersionPackageMetaData(
  result: FetchResult
): result is AllVersionsPackageMetaData {
  return Boolean((result as AllVersionsPackageMetaData).versions);
}

export default (packageQuery: string): Observable<FetchResult> => {
  let cache = registryCache[packageQuery];
  if (!cache) {
    cache = registryCache[packageQuery] = fromFetch(
      `${registryUrl}${packageQuery}`
    ).pipe(
      flatMap((res: Response) => res.json()),
      finalize(() => {
        delete registryCache[packageQuery];
      }),
      share()
    );
  }
  return cache;
};
