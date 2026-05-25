/** Root-relative URL with Astro `base` (e.g. /pyguid/python/foo/). */
export function pathFromRoot(segment: string): string {
  const base = import.meta.env.BASE_URL;
  const clean = segment.replace(/^\//, "");
  return `${base}${clean}`;
}
