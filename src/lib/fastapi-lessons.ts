import { getCollection, type CollectionEntry } from "astro:content";
import { FASTAPI_ROADMAP_SECTIONS } from "./fastapi-roadmap/sections";

export type FastapiLessonEntry = CollectionEntry<"fastapi-lessons">;

export async function getAllFastapiLessons(): Promise<FastapiLessonEntry[]> {
  const lessons = await getCollection("fastapi-lessons");
  return lessons.sort((a, b) => a.data.order - b.data.order);
}

export function fastapiLessonUrl(id: string): string {
  return `/fastapi/${id}/`;
}

export function getAdjacentFastapiLessons(
  lessons: FastapiLessonEntry[],
  currentId: string,
): { prev: FastapiLessonEntry | null; next: FastapiLessonEntry | null } {
  const index = lessons.findIndex((lesson) => lesson.id === currentId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? lessons[index - 1]! : null,
    next: index < lessons.length - 1 ? lessons[index + 1]! : null,
  };
}

export function fastapiSectionContainsLesson(
  sectionId: string,
  currentLessonId: string | undefined,
): boolean {
  if (!currentLessonId) return false;
  return currentLessonId === sectionId || currentLessonId.startsWith(`${sectionId}-`);
}

export function getFastapiSectionForLesson(
  lesson: FastapiLessonEntry,
): (typeof FASTAPI_ROADMAP_SECTIONS)[number] | undefined {
  return FASTAPI_ROADMAP_SECTIONS.find((section) => section.id === lesson.data.sectionId);
}
