import { getCollection, type CollectionEntry } from "astro:content";
import { CURRICULUM_PARTS } from "./curriculum-outline";
import { isCurriculumLesson } from "./curriculum";
import { pathFromRoot } from "./paths";

export type LessonEntry = CollectionEntry<"lessons">;

export type LessonSection = {
  title: string;
  lessons: LessonEntry[];
};

export type LessonGroup = {
  chapter: number;
  chapterTitle: string;
  part?: number;
  partTitle?: string;
  /** Lessons with no section — shown directly under the chapter */
  lessons: LessonEntry[];
  /** Subtopic groups inside the chapter */
  sections: LessonSection[];
};

export type LessonPart = {
  part: number;
  partTitle: string;
  chapters: LessonGroup[];
};

/** URL-safe anchor for a topic heading (no chapter numbers). */
export function topicAnchorId(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/\(\)/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "topic"
  );
}

export function groupHasLessons(group: LessonGroup): boolean {
  return group.lessons.length > 0 || group.sections.some((s) => s.lessons.length > 0);
}

export async function getAllLessons(): Promise<LessonEntry[]> {
  const lessons = await getCollection("lessons");
  return lessons
    .filter((lesson) => isCurriculumLesson(lesson.id))
    .sort((a, b) => a.data.order - b.data.order);
}

export function lessonUrl(id: string): string {
  return pathFromRoot(`python/${id}/`);
}

function buildSections(lessons: LessonEntry[]): LessonSection[] {
  const sections: LessonSection[] = [];
  const indexByTitle = new Map<string, number>();

  for (const lesson of lessons) {
    const title = lesson.data.section;
    if (!title) continue;

    if (!indexByTitle.has(title)) {
      indexByTitle.set(title, sections.length);
      sections.push({ title, lessons: [] });
    }
    sections[indexByTitle.get(title)!]!.lessons.push(lesson);
  }

  return sections;
}

export async function getLessonGroups(): Promise<LessonGroup[]> {
  const lessons = await getAllLessons();
  const map = new Map<number, LessonGroup>();

  for (const lesson of lessons) {
    const { chapter, chapterTitle, part, partTitle } = lesson.data;
    if (!map.has(chapter)) {
      map.set(chapter, {
        chapter,
        chapterTitle,
        part,
        partTitle,
        lessons: [],
        sections: [],
      });
    }
    map.get(chapter)!.lessons.push(lesson);
  }

  for (const group of map.values()) {
    group.lessons.sort((a, b) => a.data.order - b.data.order);
    const sectioned = group.lessons.filter((l) => l.data.section);
    group.sections = buildSections(sectioned);
    group.lessons = group.lessons.filter((l) => !l.data.section);
  }

  return [...map.values()].sort((a, b) => a.chapter - b.chapter);
}

export async function getLessonParts(): Promise<LessonPart[]> {
  const groups = await getLessonGroups();
  return CURRICULUM_PARTS.map((part) => ({
    part: part.id,
    partTitle: part.title,
    chapters: groups.filter(
      (g) =>
        g.chapter >= part.chapterFrom &&
        g.chapter <= part.chapterTo &&
        groupHasLessons(g),
    ),
  })).filter((part) => part.chapters.length > 0);
}

/** Topics with lessons, for tutorial outline and sidebar (no part groupings). */
export async function getOutlineGroups(): Promise<LessonGroup[]> {
  const groups = await getLessonGroups();
  return groups.filter(groupHasLessons);
}

/** Flat list of lessons in sidebar display order (for prev/next remains global order) */
export function groupContainsLesson(group: LessonGroup, lessonId: string): boolean {
  if (group.lessons.some((l) => l.id === lessonId)) return true;
  return group.sections.some((s) => s.lessons.some((l) => l.id === lessonId));
}

/** All lessons in a topic, in reading order (sections are not shown in the nav). */
export function getAllLessonsInGroup(group: LessonGroup): LessonEntry[] {
  return [...group.lessons, ...group.sections.flatMap((s) => s.lessons)].sort(
    (a, b) => a.data.order - b.data.order,
  );
}

export function getAdjacentLessons(
  lessons: LessonEntry[],
  currentId: string,
): { prev: LessonEntry | null; next: LessonEntry | null } {
  const idx = lessons.findIndex((l) => l.id === currentId);
  return {
    prev: idx > 0 ? lessons[idx - 1]! : null,
    next: idx < lessons.length - 1 ? lessons[idx + 1]! : null,
  };
}

export function getTotalLessonCount(groups: LessonGroup[]): number {
  return groups.reduce(
    (n, g) => n + g.lessons.length + g.sections.reduce((m, s) => m + s.lessons.length, 0),
    0,
  );
}
