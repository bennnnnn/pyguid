/** Root-relative URL (respects Astro `base` if you ever set one). */
export function pathFromRoot(segment: string): string {
  const base = import.meta.env.BASE_URL;
  const clean = segment.replace(/^\//, "");
  return `${base}${clean}`;
}
