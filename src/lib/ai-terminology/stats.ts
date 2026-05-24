import { AI_TERMINOLOGY_SECTIONS } from "./sections";

export function getAiTerminologyStats() {
  const sectionCount = AI_TERMINOLOGY_SECTIONS.length;
  const termCount = AI_TERMINOLOGY_SECTIONS.reduce((n, s) => n + s.terms.length, 0);
  return { sectionCount, termCount };
}
