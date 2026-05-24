export const SITE = {
  name: "PyGuide",
  title: "PyGuide — Learn Python from Zero to Job-Ready",
  description:
    "Free Python course with runnable examples, projects, and a path from beginner syntax to testing, APIs, Git, and real developer skills. Learn in order or jump to any topic.",
  /** Canonical URL — set SITE_URL env at build time to override (see astro.config.mjs) */
  url: "https://bennnnnn.github.io/pyguid",
  locale: "en_US",
} as const;

/** Production site URL (Astro `site` config or SITE.url fallback). */
export function getSiteUrl(site?: URL | string): string {
  if (typeof site === "string" && site) return site.replace(/\/$/, "");
  if (site instanceof URL) return site.origin;
  return SITE.url.replace(/\/$/, "");
}
