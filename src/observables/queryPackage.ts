import { of, EMPTY, Observable } from "rxjs";
import { delay, flatMap } from "rxjs/operators";
import { fromFetch } from "./fetch";

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
        : (fromFetch(getQueryUrl(query)).pipe(
            flatMap((res: Response) => res.json())
          ) as Observable<PackageQuery[]>)
    )
  );
};
