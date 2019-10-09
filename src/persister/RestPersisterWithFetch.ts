import FetchAdapter from "@pollyjs/adapter-fetch";
import { Polly } from "@pollyjs/core";
import Persister from "@pollyjs/persister";

function buildUrl(host: string, apiNamespace: string, url: string) {
  return `${host}${apiNamespace}${url}`;
}

export default class RestPersisterWithFetch extends Persister {
  get name() {
    return "rest";
  }
  constructor(polly: Polly) {
    // @ts-ignore
    super(polly);
    const fetchAdapter: FetchAdapter = (polly.adapters.get(
      "fetch"
    ) as unknown) as FetchAdapter;
    // @ts-ignore
    this.nativeFetch = fetchAdapter.nativeFetch;
  }
  get defaultOptions() {
    return {
      host: "http://localhost:4000",
      apiNamespace: "/npm-explorer",
    };
  }

  fetch(url: string, args: any) {
    const { host, apiNamespace } = this.options;
    // @ts-ignore
    return this.nativeFetch.call(
      window,
      buildUrl(host, apiNamespace, url),
      args
    );
  }

  async findRecording(recordingId: string) {
    const response = await this.fetch(`/${encodeURIComponent(recordingId)}`, {
      headers: { Accept: "application/json; charset=utf-8" },
    });

    return this._normalize(response);
  }

  async saveRecording(recordingId: string, data: any) {
    await this.fetch(`/${encodeURIComponent(recordingId)}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json; charset=utf-8",
      },
    });
  }

  async deleteRecording(recordingId: string) {
    await this.fetch(`/${encodeURIComponent(recordingId)}`, {
      method: "DELETE",
    });
  }

  _normalize(res: Response) {
    if (res.status === 204) {
      return null;
    }

    return res.json();
  }
}
