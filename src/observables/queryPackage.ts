import { of, EMPTY, Observable, Subject } from "rxjs";
import { delay, flatMap, switchMap } from "rxjs/operators";
import fetchJson from "../utils/fetchJson";

const getQueryUrl = (query: string) =>
  `https://npm-registry-proxy.glitch.me/search/suggestions?q=${query}`;

export const getQueryObservable$ = (query: string) => {
  return of(query).pipe(
    delay(400),
    flatMap(query =>
      query === ""
        ? EMPTY
        : new Observable<any>(subsriber => {
            let done = false;
            let aborted = false;
            const abortController = new AbortController();
            (async () => {
              try {
                const data = await fetchJson(
                  getQueryUrl(query),
                  abortController.signal
                );
                done = true;
                subsriber.next(data);
                subsriber.complete();
              } catch (e) {
                if (!aborted) {
                  subsriber.error(e);
                }
              }
            })();
            return () => {
              if (!done) {
                aborted = true;
                abortController.abort();
              }
            };
          })
    )
  );
};

export default (subject: Subject<string>) => {
  return subject.pipe(switchMap(query => getQueryObservable$(query)));
};
