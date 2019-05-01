import fetchJson from "./fetchJson";

const registryUrl = "https://npm-registry-proxy.glitch.me/";
// backup url
// const registryUrl = "https://registry.npmjs.cf/";

export default (packageQuery: string) => {
  return fetchJson(`${registryUrl}${packageQuery}`);
};
