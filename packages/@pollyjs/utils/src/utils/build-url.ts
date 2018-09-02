import URL from 'url-parse';

export default function buildUrl(...paths: string[]) {
  const url = new URL(
    paths
      .map(p => p && (p + '').trim()) // Trim each string
      .filter(Boolean) // Remove empty strings or other falsy paths
      .join('/')
  );

  // Replace 2+ consecutive slashes with 1. (e.g. `///` --> `/`)
  url.set('pathname', url.pathname.replace(/\/{2,}/g, '/'));

  return url.href;
}
