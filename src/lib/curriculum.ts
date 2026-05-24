import curriculum from "../../docs/curriculum-order.json";

/** Slugs published in the course (sidebar, sitemap, lesson routes). */
export const CURRICULUM_SLUGS = new Set(curriculum.lessons.map((entry) => entry.slug));

export function isCurriculumLesson(slug: string): boolean {
  return CURRICULUM_SLUGS.has(slug);
}
