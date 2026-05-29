export type { FastapiRoadmapLesson, FastapiRoadmapSection, FastapiRoadmapMeta } from "./types";
export { FASTAPI_ROADMAP_META } from "./meta";
export { FASTAPI_ROADMAP_SECTIONS } from "./sections";
export { FASTAPI_LEARNING_PHASES } from "./learning-path";
export type { FastapiLearningPhase } from "./learning-path";

import { FASTAPI_ROADMAP_SECTIONS } from "./sections";

export function getFastapiRoadmapStats() {
  const lessonCount = FASTAPI_ROADMAP_SECTIONS.reduce(
    (total, section) => total + section.lessons.length,
    0,
  );
  return {
    sectionCount: FASTAPI_ROADMAP_SECTIONS.length,
    lessonCount,
  };
}

export function fastapiSectionAnchorId(sectionId: string): string {
  return `fastapi-${sectionId}`;
}
