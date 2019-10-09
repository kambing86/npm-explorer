import FetchAdapter from "@pollyjs/adapter-fetch";
// import RESTPersister from "@pollyjs/persister-rest";
import XHRAdapter from "@pollyjs/adapter-xhr";
import { Polly } from "@pollyjs/core";
import RestPersisterWithFetch from "../persister/RestPersisterWithFetch";

Polly.register(XHRAdapter);
Polly.register(FetchAdapter);
// @ts-ignore
Polly.register(RestPersisterWithFetch);

export async function recordedFetch(url: string, options?: RequestInit) {
  // @ts-ignore
  const polly = new Polly(url, {
    adapters: [FetchAdapter, XHRAdapter],
    persister: RestPersisterWithFetch,
  });
  const response = await fetch(url, options);
  polly.stop();
  return response;
}
