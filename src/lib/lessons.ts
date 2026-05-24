import { getCollection, type CollectionEntry } from "astro:content";

export type LessonEntry = CollectionEntry<"lessons">;

export type LessonSection = {
  title: string;
  lessons: LessonEntry[];
};

export type LessonGroup = {
  chapter: number;
  chapterTitle: string;
  /** Lessons with no section — shown directly under the chapter */
  lessons: LessonEntry[];
  /** Nested topic groups (e.g. Strings, Lists) */
  sections: LessonSection[];
};

export async function getAllLessons(): Promise<LessonEntry[]> {
  const lessons = await getCollection("lessons");
  return lessons.sort((a, b) => a.data.order - b.data.order);
}

export async function getLessonById(id: string): Promise<LessonEntry | undefined> {
  const lessons = await getAllLessons();
  return lessons.find((l) => l.id === id);
}

export function lessonUrl(id: string): string {
  return `/python/${id}/`;
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
    const { chapter, chapterTitle } = lesson.data;
    if (!map.has(chapter)) {
      map.set(chapter, { chapter, chapterTitle, lessons: [], sections: [] });
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

/** Flat list of lessons in sidebar display order (for prev/next remains global order) */
export function groupContainsLesson(group: LessonGroup, lessonId: string): boolean {
  if (group.lessons.some((l) => l.id === lessonId)) return true;
  return group.sections.some((s) => s.lessons.some((l) => l.id === lessonId));
}

export function sectionHasActiveLesson(
  section: LessonSection,
  lessonId?: string,
): boolean {
  if (!lessonId) return false;
  return section.lessons.some((l) => l.id === lessonId);
}

export type ChapterNavItem =
  | { kind: "lesson"; lesson: LessonEntry }
  | { kind: "section"; section: LessonSection };

/** Sidebar order: top-level lessons and nested sections by lesson order */
export function getChapterNavItems(group: LessonGroup): ChapterNavItem[] {
  const items: ChapterNavItem[] = [];
  const seenSections = new Set<string>();

  const allLessons = [...group.lessons, ...group.sections.flatMap((s) => s.lessons)].sort(
    (a, b) => a.data.order - b.data.order,
  );

  for (const lesson of allLessons) {
    const sectionTitle = lesson.data.section;
    if (sectionTitle) {
      if (!seenSections.has(sectionTitle)) {
        seenSections.add(sectionTitle);
        const section = group.sections.find((s) => s.title === sectionTitle);
        if (section) items.push({ kind: "section", section });
      }
    } else {
      items.push({ kind: "lesson", lesson });
    }
  }

  return items;
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

/** All lessons in a chapter, in sidebar order */
export function getAllLessonsInGroup(group: LessonGroup): LessonEntry[] {
  const items = getChapterNavItems(group);
  const ordered: LessonEntry[] = [];
  for (const item of items) {
    if (item.kind === "lesson") {
      ordered.push(item.lesson);
    } else {
      ordered.push(...item.section.lessons);
    }
  }
  return ordered;
}

export function getTotalLessonCount(groups: LessonGroup[]): number {
  return groups.reduce(
    (n, g) => n + g.lessons.length + g.sections.reduce((m, s) => m + s.lessons.length, 0),
    0,
  );
}
