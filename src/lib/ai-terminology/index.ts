export type { AiTerm, AiTerminologySection, AiTerminologyMeta } from "./types";
export { AI_TERMINOLOGY_META } from "./meta";
export { AI_TERMINOLOGY_SECTIONS } from "./sections";
export {
  AI_TERMINOLOGY_PARTS,
  AI_TERMINOLOGY_SECTION_ORDER,
  AI_TERM_UNPUBLISHED_SECTION_IDS,
  getAiTerminologyPartsWithSections,
  getPublishedAiTerminologySections,
  isAiTerminologySectionPublished,
} from "./catalog";
export type { AiTerminologyPart, AiTerminologyPartWithSections } from "./catalog";
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

import { getPublishedAiTerminologySections } from "./catalog";
import type { AiTerminologySection } from "./types";

export function getAiTerminologySection(
  sectionId: string,
): AiTerminologySection | undefined {
  return getPublishedAiTerminologySections().find((s) => s.id === sectionId);
}

export {
  AI_TERM_SIDEBAR_ORDER,
  getAiTerminologySectionsForSidebar,
} from "./sidebar-order";
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
  const sections = getPublishedAiTerminologySections();
  const idx = sections.findIndex((s) => s.id === sectionId);
  return {
    prev: idx > 0 ? sections[idx - 1]! : null,
    next: idx >= 0 && idx < sections.length - 1 ? sections[idx + 1]! : null,
  };
}
