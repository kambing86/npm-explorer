import { EMPTY, type Observable, of } from "rxjs";
import { fromFetch } from "rxjs/fetch";
import { delay, mergeMap } from "rxjs/operators";

const getQueryUrl = (query: string) =>
  `https://www.npmjs.com/search/suggestions?q=${query}`;

interface PackageQuery {
  name: string;
}

export type QueryResult = PackageQuery[];

export const getQueryObservable$ = (
  query: string,
): Observable<PackageQuery[]> => {
  if (query === "") {
    return EMPTY;
  }
  return of(query).pipe(
    delay(400),
    mergeMap((q) => fromFetch(getQueryUrl(q))),
    mergeMap((res) => res.json() as Promise<PackageQuery[]>),
  );
};
