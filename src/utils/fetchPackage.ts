import fetchJson from "./fetchJson";

const registryUrl = "https://npm-registry-proxy.glitch.me/";
// backup url
// const registryUrl = "https://registry.npmjs.cf/";
const registryCache: { [key: string]: Promise<any> } = {};

export default async (packageQuery: string) => {
  const cache = registryCache[packageQuery];
  if (cache) {
    return cache;
  }
  try {
    const response = await (registryCache[packageQuery] = fetchJson(
      `${registryUrl}${packageQuery}`
    ));
    return response;
  } finally {
    delete registryCache[packageQuery];
  }
};
