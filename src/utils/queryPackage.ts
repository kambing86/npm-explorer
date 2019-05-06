import fetchJson from "./fetchJson";
import { EMPTY, Observable, Subject, of } from "rxjs";
import { switchMap, delay, flatMap } from "rxjs/operators";

const getQueryUrl = (query: string) =>
  `https://npm-registry-proxy.glitch.me/search/suggestions?q=${query}`;

export default async (query: string) => {
  if (query === "") {
    return [];
  }

  return await fetchJson(getQueryUrl(query));
};

const getQueryObservable$ = (query: string) => {
  return of(query).pipe(
    delay(400),
    flatMap(
      query =>
        new Observable<any>(subsriber => {
          const abortController = new AbortController();
          (async () => {
            try {
              const data = await fetchJson(
                getQueryUrl(query),
                abortController.signal
              );
              subsriber.next(data);
              subsriber.complete();
            } catch (e) {
              subsriber.error(e);
            }
          })();
          return () => {
            abortController.abort();
          };
        })
    )
  );
};

export const queryPackage$ = (subject: Subject<string>) => {
  return subject.pipe(
    switchMap(query => (query === "" ? EMPTY : getQueryObservable$(query)))
  );
};
