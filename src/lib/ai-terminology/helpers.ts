import type { AiTerm } from "./types";

/** Build term entries from compact tuples: [term, meaning, python?] */
export function gloss(entries: [string, string, string?][]): AiTerm[] {
  return entries.map(([term, meaning, python]) => ({
    term,
    meaning,
    ...(python ? { python } : {}),
  }));
}

function slugifyTerm(term: string): string {
  let s = term.toLowerCase();
  s = s.replace(/\([^)]*\)/g, "");
  s = s.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return s || "term";
}

/** Stable anchor id for a term within a section (used in sidebar + in-page links). */
export function termAnchorId(sectionId: string, term: string, index: number): string {
  const base = slugifyTerm(term);
  return index === 0 ? `${sectionId}-${base}` : `${sectionId}-${base}-${index}`;
}

export function termAnchorsForSection(sectionId: string, terms: AiTerm[]): string[] {
  const seen = new Map<string, number>();
  return terms.map((t, index) => {
    const base = slugifyTerm(t.term);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    if (count === 0) return `${sectionId}-${base}`;
    return `${sectionId}-${base}-${count}`;
  });
}

export function aiTerminologySectionUrl(sectionId: string): string {
  return `/ai-terminology/${sectionId}/`;
}

export function termPageUrl(anchorId: string): string {
  return `#${anchorId}`;
}
