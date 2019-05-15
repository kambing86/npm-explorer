import fetchJson from "../utils/fetchJson";
import { EMPTY, Observable, Subject, of } from "rxjs";
import { switchMap, delay, flatMap } from "rxjs/operators";

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
                subsriber.error(e);
              }
            })();
            return () => {
              if (!done) {
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
