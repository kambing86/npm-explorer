export default async (url: string, signal?: AbortSignal) => {
  const response = await fetch(url, { signal });
  if (response.ok) {
    return await response.json();
  }
  throw new Error(await response.text());
};
