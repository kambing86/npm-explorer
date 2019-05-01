import fetchJson from "./fetchJson";

export default async (query: string) => {
  if (query === "") {
    return [];
  }

  const data = await fetchJson(
    `https://npm-registry-proxy.glitch.me/search/suggestions?q=${query}`
  );
  return data.map((packageInfo: any) => ({
    label: packageInfo.name,
    value: packageInfo.name
  }));
};
