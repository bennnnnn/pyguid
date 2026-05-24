/** 11-part, 59-chapter pure Python curriculum (Tutorials → Quizzes → References). */

export type CurriculumPart = {
  id: number;
  title: string;
  chapterFrom: number;
  chapterTo: number;
};

export type CurriculumChapter = {
  number: number;
  title: string;
  partId: number;
};

export const CURRICULUM_PARTS: CurriculumPart[] = [
  { id: 1, title: "Absolute beginner", chapterFrom: 1, chapterTo: 5 },
  { id: 2, title: "Variables and input", chapterFrom: 6, chapterTo: 8 },
  { id: 3, title: "Types, numbers, and strings", chapterFrom: 9, chapterTo: 12 },
  { id: 4, title: "Booleans and conditions", chapterFrom: 13, chapterTo: 14 },
  { id: 5, title: "Collections and loops", chapterFrom: 15, chapterTo: 21 },
  { id: 6, title: "Functions", chapterFrom: 22, chapterTo: 25 },
  {
    id: 7,
    title: "Files, modules, and the standard library",
    chapterFrom: 26,
    chapterTo: 35,
  },
  { id: 8, title: "Object-oriented Python", chapterFrom: 36, chapterTo: 40 },
  { id: 9, title: "Advanced Python", chapterFrom: 41, chapterTo: 49 },
  { id: 10, title: "Debugging, testing, and clean code", chapterFrom: 50, chapterTo: 54 },
  { id: 11, title: "Expert topics (coming later)", chapterFrom: 55, chapterTo: 59 },
];

export const CURRICULUM_CHAPTERS: CurriculumChapter[] = [
  { number: 1, title: "What Is Python?", partId: 1 },
  { number: 2, title: "Running Python Code", partId: 1 },
  { number: 4, title: "Comments", partId: 1 },
  { number: 5, title: "Errors Are Normal", partId: 1 },
  { number: 6, title: "Variables", partId: 2 },
  { number: 7, title: "input()", partId: 2 },
  { number: 8, title: "Type Conversion", partId: 2 },
  { number: 9, title: "Data Types", partId: 3 },
  { number: 10, title: "Numbers", partId: 3 },
  { number: 11, title: "Operators", partId: 3 },
  { number: 12, title: "Strings", partId: 3 },
  { number: 13, title: "Booleans", partId: 4 },
  { number: 14, title: "Conditions", partId: 4 },
  { number: 15, title: "Lists", partId: 5 },
  { number: 16, title: "Loops", partId: 5 },
  { number: 17, title: "Loop Patterns", partId: 5 },
  { number: 18, title: "Tuples", partId: 5 },
  { number: 19, title: "Sets", partId: 5 },
  { number: 20, title: "Dictionaries", partId: 5 },
  { number: 21, title: "Comprehensions", partId: 5 },
  { number: 22, title: "Functions", partId: 6 },
  { number: 23, title: "Scope", partId: 6 },
  { number: 24, title: "Advanced Function Concepts", partId: 6 },
  { number: 25, title: "Errors and Exceptions", partId: 6 },
  { number: 26, title: "Files", partId: 7 },
  { number: 27, title: "Pathlib", partId: 7 },
  { number: 28, title: "Modules", partId: 7 },
  { number: 29, title: "Built-in Functions", partId: 7 },
  { number: 30, title: "Standard Library Essentials", partId: 7 },
  { number: 31, title: "JSON", partId: 7 },
  { number: 32, title: "CSV", partId: 7 },
  { number: 33, title: "Regex", partId: 7 },
  { number: 34, title: "Date and Time", partId: 7 },
  { number: 35, title: "Packages, Pip, and Virtual Environments", partId: 7 },
  { number: 36, title: "Classes and Objects", partId: 8 },
  { number: 37, title: "Class Design", partId: 8 },
  { number: 38, title: "Inheritance", partId: 8 },
  { number: 39, title: "Dunder Methods", partId: 8 },
  { number: 40, title: "Dataclasses", partId: 8 },
  { number: 41, title: "Type Hints", partId: 9 },
  { number: 42, title: "Iterators", partId: 9 },
  { number: 43, title: "Generators", partId: 9 },
  { number: 44, title: "Decorators", partId: 9 },
  { number: 45, title: "Context Managers", partId: 9 },
  { number: 46, title: "Functional Tools", partId: 9 },
  { number: 47, title: "collections Module", partId: 9 },
  { number: 48, title: "itertools", partId: 9 },
  { number: 49, title: "functools", partId: 9 },
  { number: 50, title: "Debugging", partId: 10 },
  { number: 51, title: "Testing", partId: 10 },
  { number: 52, title: "Clean Python Style", partId: 10 },
  { number: 53, title: "Performance Basics", partId: 10 },
  { number: 54, title: "Memory and Object Model", partId: 10 },
  { number: 55, title: "Python Execution Model", partId: 11 },
  { number: 56, title: "Advanced OOP", partId: 11 },
  { number: 57, title: "Concurrency Basics", partId: 11 },
  { number: 58, title: "Async Python", partId: 11 },
  { number: 59, title: "Advanced Packaging Preview", partId: 11 },
];

const chapterByNumber = new Map(CURRICULUM_CHAPTERS.map((c) => [c.number, c]));
const partById = new Map(CURRICULUM_PARTS.map((p) => [p.id, p]));

export function getChapterMeta(chapter: number): CurriculumChapter | undefined {
  return chapterByNumber.get(chapter);
}

export function getPartForChapter(chapter: number): CurriculumPart | undefined {
  const ch = chapterByNumber.get(chapter);
  if (!ch) return undefined;
  return partById.get(ch.partId);
}

export function getPartTitle(chapter: number): string {
  return getPartForChapter(chapter)?.title ?? "";
}
