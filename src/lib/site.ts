export const SITE = {
  name: "PyGuide",
  title: "PyGuide — Learn Python with Tutorials, Quizzes & References",
  description:
    "Learn Python from zero to advanced core Python with beginner-friendly tutorials, separate quizzes, and clean reference pages. Run code in your browser — no install required.",
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
