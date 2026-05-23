import { getCollection, type CollectionEntry } from "astro:content";

export type ChapterEntry = CollectionEntry<"chapters">;

export async function getAllChapters(): Promise<ChapterEntry[]> {
  const chapters = await getCollection("chapters");
  return chapters.sort((a, b) => a.data.order - b.data.order);
}

export async function getChapterById(
  id: string,
): Promise<ChapterEntry | undefined> {
  const chapters = await getAllChapters();
  return chapters.find((c) => c.id === id);
}

/** URL segment for a chapter (content entry id, e.g. `01-hello-python`). */
export function chapterId(entry: ChapterEntry): string {
  return entry.id;
}

export function chapterUrl(id: string): string {
  return `/learn/${id}/`;
}

export function subtopicUrl(chapterId: string, subtopicId: string): string {
  return `${chapterUrl(chapterId)}#${subtopicId}`;
}
