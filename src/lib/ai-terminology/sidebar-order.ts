import { getPublishedAiTerminologySections } from "./catalog";
import type { AiTerminologySection } from "./types";

/** @deprecated Use getPublishedAiTerminologySections — kept for imports. */
export const AI_TERM_SIDEBAR_ORDER: string[] = getPublishedAiTerminologySections().map(
  (s) => s.id,
);

export function getAiTerminologySectionsForSidebar(): AiTerminologySection[] {
  return getPublishedAiTerminologySections();
}
