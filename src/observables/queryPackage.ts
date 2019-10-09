import { from, of, EMPTY, Observable } from "rxjs";
// import { fromFetch } from "rxjs/fetch";
import { delay, flatMap } from "rxjs/operators";
import { recordedFetch } from "../utils/recordedFetch";

const getQueryUrl = (query: string) =>
  `https://npm-registry-proxy.glitch.me/search/suggestions?q=${query}`;

interface PackageQuery {
  name: string;
}

export type QueryResult = PackageQuery[];

export const getQueryObservable$ = (query: string) => {
  return of(query).pipe(
    delay(400),
    flatMap(query =>
      query === ""
        ? EMPTY
        : (from(recordedFetch(getQueryUrl(query))).pipe(
            flatMap((res: Response) => res.json())
          ) as Observable<PackageQuery[]>)
    )
  );
};
