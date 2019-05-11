import fetchJson from "./fetchJson";
import { Observable } from "rxjs";

const registryUrl = "https://npm-registry-proxy.glitch.me/";
// backup url
// const registryUrl = "https://registry.npmjs.cf/";
const registryCache: { [key: string]: Promise<any> } = {};

export default (packageQuery: string) =>
  new Observable<any>(subsriber => {
    let done = false;
    const abortController = new AbortController();
    (async () => {
      try {
        const cache = registryCache[packageQuery];
        if (cache) {
          subsriber.next(await cache);
          subsriber.complete();
          return;
        }
        const response = await (registryCache[packageQuery] = fetchJson(
          `${registryUrl}${packageQuery}`,
          abortController.signal
        ));
        done = true;
        delete registryCache[packageQuery];
        subsriber.next(response);
        subsriber.complete();
      } catch (e) {
        delete registryCache[packageQuery];
        subsriber.error(e);
      }
    })();
    return () => {
      if (!done) {
        abortController.abort();
      }
    };
  });
