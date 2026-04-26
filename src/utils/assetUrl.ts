export function assetUrl(url: string): string {
  if (url.startsWith('http')) return url;
  return import.meta.env.BASE_URL + url.replace(/^\//, '');
}
