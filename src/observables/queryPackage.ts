import { of, EMPTY, Observable } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { delay, flatMap } from "rxjs/operators";

const getQueryUrl = (query: string) =>
  `https://npm-registry-proxy.glitch.me/search/suggestions?q=${query}`;

interface PackageQuery {
  name: string;
}

export type QueryResult = PackageQuery[];

export const getQueryObservable$ = (
  query: string
): Observable<PackageQuery[]> => {
  if (query === "") {
    return EMPTY;
  }
  return of(query).pipe(
    delay(400),
    flatMap(query =>
      fromFetch(getQueryUrl(query)).pipe(flatMap((res: Response) => res.json()))
    )
  );
};
