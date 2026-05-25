export const SITE = {
  name: "PyGuide",
  title: "PyGuide — Learn Python from Zero to Advanced Core Python",
  description:
    "Free Python-only tutorials, quizzes, and references with runnable examples. Learn Python from the basics to advanced core Python topics.",
  /** Canonical URL — set SITE_URL at build time (Vercel env); local default below */
  url: "http://localhost:4321",
  locale: "en_US",
} as const;

/** Production site URL (Astro `site` config or SITE.url fallback). */
export function getSiteUrl(site?: URL | string): string {
  if (typeof site === "string" && site) return site.replace(/\/$/, "");
  if (site instanceof URL) return site.origin;
  return SITE.url.replace(/\/$/, "");
}
