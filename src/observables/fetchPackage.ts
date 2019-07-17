import { Observable } from "rxjs";
import fetchJson from "../utils/fetchJson";

const registryUrl = "https://npm-registry-proxy.glitch.me/";
// backup url
// const registryUrl = "https://registry.npmjs.cf/";
const registryCache: { [key: string]: Promise<unknown> } = {};

export default (packageQuery: string) =>
  new Observable(subsriber => {
    let abortController: AbortController | null = null;
    let aborted = false;
    function cleanup() {
      abortController = null;
      delete registryCache[packageQuery];
    }
    (async () => {
      try {
        let cache = registryCache[packageQuery];
        if (!cache) {
          abortController = new AbortController();
          cache = registryCache[packageQuery] = fetchJson(
            `${registryUrl}${packageQuery}`,
            abortController.signal
          );
        }
        const response = await cache;
        cleanup();
        subsriber.next(response);
        subsriber.complete();
      } catch (e) {
        cleanup();
        if (!aborted) {
          subsriber.error(e);
        }
      }
    })();
    return () => {
      if (abortController) {
        aborted = true;
        abortController.abort();
      }
    };
  });
