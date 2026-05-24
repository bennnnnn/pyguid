import type { AiTerm } from "./types";
import { TERM_ENRICHMENT } from "./term-enrichment";

export type TermEnrichment = {
  aliases?: string[];
  related?: string[];
  simple?: string;
};

/** Plain-language lead for long definitions when no curated simple line exists. */
export function deriveSimpleSentence(meaning: string, term: string): string | undefined {
  const trimmed = meaning.trim();
  if (trimmed.length < 145) return undefined;

  const firstSentence = trimmed.match(/^(.+?[.!?])(?:\s|$)/)?.[1]?.trim();
  if (!firstSentence || firstSentence.length < 24 || firstSentence.length > 200) {
    return `In plain terms, ${term} is a core AI idea you will see in docs, courses, and Python ML projects.`;
  }

  if (firstSentence.length > 120) {
    return `In plain terms: ${firstSentence}`;
  }
  return `In plain terms: ${firstSentence} Read on for detail.`;
}

function enrichmentKey(sectionId: string, anchorId: string, term: string): string[] {
  return [anchorId, `${sectionId}::${term}`, term.toLowerCase()];
}

export function lookupTermEnrichment(
  sectionId: string,
  term: string,
  anchorId: string,
): TermEnrichment {
  for (const key of enrichmentKey(sectionId, anchorId, term)) {
    const hit = TERM_ENRICHMENT[key];
    if (hit) return hit;
  }
  return {};
}

export function enrichSectionTerms(
  sectionId: string,
  terms: AiTerm[],
  anchorIds: string[],
): AiTerm[] {
  return terms.map((entry, index) => {
    const anchorId = anchorIds[index] ?? "";
    const extra = lookupTermEnrichment(sectionId, entry.term, anchorId);
    const simple = extra.simple ?? deriveSimpleSentence(entry.meaning, entry.term);
    const aliases = extra.aliases?.length ? extra.aliases : undefined;
    const related = extra.related?.length ? extra.related : undefined;

    return {
      ...entry,
      ...(simple ? { simple } : {}),
      ...(aliases ? { aliases } : {}),
      ...(related ? { related } : {}),
    };
  });
}

export function termSearchBlob(term: AiTerm, sectionTitle: string): string {
  return [
    term.term,
    term.simple ?? "",
    term.meaning,
    term.python ?? "",
    term.example ?? "",
    sectionTitle,
    ...(term.aliases ?? []),
    ...(term.related ?? []),
  ]
    .join(" ")
    .toLowerCase();
}
