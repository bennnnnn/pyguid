export type { AiTerm, AiTerminologySection, AiTerminologyMeta } from "./types";
export { AI_TERMINOLOGY_META } from "./meta";
export { AI_TERMINOLOGY_SECTIONS } from "./sections";
export {
  aiTerminologySectionUrl,
  termAnchorId,
  termAnchorsForSection,
  termPageUrl,
} from "./helpers";
export {
  termCountAriaLabel,
  termLabelClass,
  termLooksLikeCode,
  toGlossaryEntries,
} from "./display";
export type { GlossaryEntryView } from "./display";

import { AI_TERMINOLOGY_SECTIONS } from "./sections";
import type { AiTerminologySection } from "./types";

export function getAiTerminologySection(sectionId: string): AiTerminologySection | undefined {
  return AI_TERMINOLOGY_SECTIONS.find((s) => s.id === sectionId);
}

export { getAiTerminologyStats } from "./stats";
export {
  buildAiTerminologySearchIndex,
  buildAiTerminologySectionSearchRows,
} from "./search-index";
export type { AiTermSearchHit, AiTermSectionSearchRow } from "./search-index";
export function getAdjacentAiTerminologySections(sectionId: string): {
  prev: AiTerminologySection | null;
  next: AiTerminologySection | null;
} {
  const idx = AI_TERMINOLOGY_SECTIONS.findIndex((s) => s.id === sectionId);
  return {
    prev: idx > 0 ? AI_TERMINOLOGY_SECTIONS[idx - 1]! : null,
    next: idx >= 0 && idx < AI_TERMINOLOGY_SECTIONS.length - 1 ? AI_TERMINOLOGY_SECTIONS[idx + 1]! : null,
  };
}
