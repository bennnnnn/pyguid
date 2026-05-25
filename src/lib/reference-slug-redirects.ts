import {
  buildReferenceSheetIndexRedirects,
  getAllReferenceEntryPages,
  referenceEntryUrl,
} from "./reference-sheets";

/** Title-derived slugs (pre–syntax-first URLs) for redirects only. */
function legacySlugifyTitle(title: string): string {
  let s = title.trim().toLowerCase();
  s = s.replace(/[·]/g, "-");
  s = s.replace(/\([^)]*\)/g, "");
  s = s.replace(/[()]/g, "");
  s = s.replace(/\./g, "");
  s = s.replace(/['']/g, "");
  s = s.replace(/[^\w-]+/g, "-");
  s = s.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
  return s || "syntax";
}

/** Old verbose entry URLs → new short syntax-based URLs. */
export function buildReferenceSlugRedirects(): Record<string, string> {
  const redirects: Record<string, string> = {};

  for (const page of getAllReferenceEntryPages()) {
    const legacy = legacySlugifyTitle(page.entry.title);
    if (legacy === page.slug) continue;

    const from = referenceEntryUrl(page.sheet.id, legacy);
    const to = referenceEntryUrl(page.sheet.id, page.slug);
    redirects[from] = to;

    // Legacy slugify could produce -2 suffix for duplicates; match first index only
    if (page.index === 0 && legacy.endsWith("-1")) {
      const alt = referenceEntryUrl(page.sheet.id, legacy.replace(/-1$/, ""));
      redirects[alt] = to;
    }
  }

  return redirects;
}

export const REFERENCE_SLUG_REDIRECTS: Record<string, string> = {
  ...buildReferenceSheetIndexRedirects(),
  ...buildReferenceSlugRedirects(),
};
