import { getPublishedAiTerminologySections } from "./catalog";

export function getAiTerminologyStats() {
  const sections = getPublishedAiTerminologySections();
  const sectionCount = sections.length;
  const termCount = sections.reduce((n, s) => n + s.terms.length, 0);
  return { sectionCount, termCount };
}
