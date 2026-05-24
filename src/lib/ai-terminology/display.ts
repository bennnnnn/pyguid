import type { AiTerm } from "./types";

export function termCountAriaLabel(count: number): string {
  return count === 1 ? "1 term" : `${count} terms`;
}

/** True when the label looks like code or an API name (use mono styling). */
export function termLooksLikeCode(label: string): boolean {
  return (
    /[()]/.test(label) ||
    /\b[A-Z]{2,}\b/.test(label) ||
    /\.(py|json|md)\b/i.test(label) ||
    label.includes("/")
  );
}

export function termLabelClass(label: string): string {
  return termLooksLikeCode(label) ? "ai-glossary-term ai-glossary-term-code" : "ai-glossary-term";
}

export type GlossaryEntryView = AiTerm & {
  anchorId: string;
};

export function toGlossaryEntries(
  terms: AiTerm[],
  anchorIds: string[],
): GlossaryEntryView[] {
  return terms.map((term, index) => ({
    ...term,
    anchorId: anchorIds[index] ?? `term-${index}`,
  }));
}
