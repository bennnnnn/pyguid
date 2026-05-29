import {
  buildReferenceEntryToSheetRedirects,
  getAllReferenceEntryPages,
  referenceEntryUrl,
  referenceSheetAnchorUrl,
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

/** Old verbose entry slugs → anchor on the group page. */
export function buildReferenceSlugRedirects(): Record<string, string> {
  const redirects: Record<string, string> = {};

  for (const page of getAllReferenceEntryPages()) {
    const legacy = legacySlugifyTitle(page.entry.title);
    if (legacy === page.slug) continue;

    const from = referenceEntryUrl(page.sheet.id, legacy);
    const to = referenceSheetAnchorUrl(page.sheet.id, page.slug);
    redirects[from] = to;

    if (page.index === 0 && legacy.endsWith("-1")) {
      const alt = referenceEntryUrl(page.sheet.id, legacy.replace(/-1$/, ""));
      redirects[alt] = to;
    }
  }

  return redirects;
}

/** Old combined “Booleans and Conditions” sheet → split topics. */
const BOOLEANS_SPLIT_REDIRECTS: Record<string, string> = {
  "/python/reference/booleans/": "/python/reference/comparison-operators/",
  "/python/reference/booleans/true-false/": "/python/reference/comparison-operators/#eq",
  "/python/reference/comparison-operators/true-false/": "/python/reference/comparison-operators/#eq",
  "/python/reference/booleans/comparisons/": "/python/reference/comparison-operators/#gte",
  "/python/reference/comparison-operators/comparisons/": "/python/reference/comparison-operators/#gte",
  "/python/reference/booleans/in/": "/python/reference/comparison-operators/#in",
  "/python/reference/booleans/is/": "/python/reference/comparison-operators/#is",
  "/python/reference/booleans/and-or-not/": "/python/reference/logical-operators/#and",
  "/python/reference/logical-operators/and-or-not/": "/python/reference/logical-operators/#and",
  "/python/reference/booleans/if-cond/": "/python/reference/conditional/#if",
  "/python/reference/booleans/elif-cond/": "/python/reference/conditional/#elif",
  "/python/reference/booleans/else/": "/python/reference/conditional/#else",
  "/python/reference/logical-operators/if/": "/python/reference/conditional/#if",
  "/python/reference/logical-operators/elif/": "/python/reference/conditional/#elif",
  "/python/reference/logical-operators/else/": "/python/reference/conditional/#else",
  "/python/reference/logical-operators/if-cond/": "/python/reference/conditional/#if",
  "/python/reference/logical-operators/elif-cond/": "/python/reference/conditional/#elif",
  "/python/reference/conditionals/": "/python/reference/conditional/",
  "/python/reference/conditionals/if/": "/python/reference/conditional/#if",
  "/python/reference/conditionals/elif/": "/python/reference/conditional/#elif",
  "/python/reference/conditionals/else/": "/python/reference/conditional/#else",
  "/python/reference/conditional/match/": "/python/reference/conditional/#switch",
  "/python/reference/numbers/": "/python/reference/math-operators/",
  "/python/reference/numbers/operators/": "/python/reference/math-operators/#add",
  "/python/reference/math-operators/operators/": "/python/reference/math-operators/#add",
  "/python/reference/numbers/floor-div/": "/python/reference/math-operators/#floor-div",
  "/python/reference/numbers/modulo/": "/python/reference/math-operators/#modulo",
  "/python/reference/numbers/power/": "/python/reference/math-operators/#power",
  "/python/reference/numbers/augmented-assign/": "/python/reference/assignment-operators/#plus-eq",
  "/python/reference/numbers/plus-eq/": "/python/reference/assignment-operators/#plus-eq",
  "/python/reference/basic-data-types/": "/python/reference/data-types/",
  "/python/reference/other-data-types/": "/python/reference/data-types/#list",
  "/python/reference/data-types/builtin-types/": "/python/reference/data-types/#int",
  "/python/reference/basic-data-types/int/": "/python/reference/data-types/#int",
  "/python/reference/other-data-types/list/": "/python/reference/data-types/#list",
};

export const REFERENCE_SLUG_REDIRECTS: Record<string, string> = {
  ...buildReferenceEntryToSheetRedirects(),
  ...buildReferenceSlugRedirects(),
  ...BOOLEANS_SPLIT_REDIRECTS,
};
