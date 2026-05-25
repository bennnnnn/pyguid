/** 11-part, 58-chapter pure Python curriculum (Tutorials → Quizzes → References). */

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
  { id: 1, title: "Absolute beginner", chapterFrom: 1, chapterTo: 4 },
  { id: 2, title: "Variables and input", chapterFrom: 5, chapterTo: 7 },
  { id: 3, title: "Types, numbers, and strings", chapterFrom: 8, chapterTo: 11 },
  { id: 4, title: "Booleans and conditions", chapterFrom: 12, chapterTo: 13 },
  { id: 5, title: "Collections and loops", chapterFrom: 14, chapterTo: 20 },
  { id: 6, title: "Functions", chapterFrom: 21, chapterTo: 24 },
  {
    id: 7,
    title: "Files, modules, and the standard library",
    chapterFrom: 25,
    chapterTo: 34,
  },
  { id: 8, title: "Object-oriented Python", chapterFrom: 35, chapterTo: 39 },
  { id: 9, title: "Advanced Python", chapterFrom: 40, chapterTo: 48 },
  { id: 10, title: "Debugging, testing, and clean code", chapterFrom: 49, chapterTo: 53 },
  { id: 11, title: "Expert topics (coming later)", chapterFrom: 54, chapterTo: 58 },
];

export const CURRICULUM_CHAPTERS: CurriculumChapter[] = [
  { number: 1, title: "What Is Python?", partId: 1 },
  { number: 2, title: "Python Code Basics", partId: 1 },
  { number: 3, title: "Comments", partId: 1 },
  { number: 4, title: "Beginner Errors", partId: 1 },
  { number: 5, title: "Variables", partId: 2 },
  { number: 6, title: "input()", partId: 2 },
  { number: 7, title: "Type Conversion", partId: 2 },
  { number: 8, title: "Data Types", partId: 3 },
  { number: 9, title: "Numbers", partId: 3 },
  { number: 10, title: "Operators", partId: 3 },
  { number: 11, title: "Strings", partId: 3 },
  { number: 12, title: "Booleans", partId: 4 },
  { number: 13, title: "Conditions", partId: 4 },
  { number: 14, title: "Lists", partId: 5 },
  { number: 15, title: "Loops", partId: 5 },
  { number: 16, title: "Loop Patterns", partId: 5 },
  { number: 17, title: "Tuples", partId: 5 },
  { number: 18, title: "Sets", partId: 5 },
  { number: 19, title: "Dictionaries", partId: 5 },
  { number: 20, title: "Comprehensions", partId: 5 },
  { number: 21, title: "Functions", partId: 6 },
  { number: 22, title: "Scope", partId: 6 },
  { number: 23, title: "Advanced Function Concepts", partId: 6 },
  { number: 24, title: "Errors and Exceptions", partId: 6 },
  { number: 25, title: "Files", partId: 7 },
  { number: 26, title: "Pathlib", partId: 7 },
  { number: 27, title: "Modules", partId: 7 },
  { number: 28, title: "Built-in Functions", partId: 7 },
  { number: 29, title: "Standard Library Essentials", partId: 7 },
  { number: 30, title: "JSON", partId: 7 },
  { number: 31, title: "CSV", partId: 7 },
  { number: 32, title: "Regex", partId: 7 },
  { number: 33, title: "Date and Time", partId: 7 },
  { number: 34, title: "Packages, Pip, and Virtual Environments", partId: 7 },
  { number: 35, title: "Classes and Objects", partId: 8 },
  { number: 36, title: "Class Design", partId: 8 },
  { number: 37, title: "Inheritance", partId: 8 },
  { number: 38, title: "Dunder Methods", partId: 8 },
  { number: 39, title: "Dataclasses", partId: 8 },
  { number: 40, title: "Type Hints", partId: 9 },
  { number: 41, title: "Iterators", partId: 9 },
  { number: 42, title: "Generators", partId: 9 },
  { number: 43, title: "Decorators", partId: 9 },
  { number: 44, title: "Context Managers", partId: 9 },
  { number: 45, title: "Functional Tools", partId: 9 },
  { number: 46, title: "collections Module", partId: 9 },
  { number: 47, title: "itertools", partId: 9 },
  { number: 48, title: "functools", partId: 9 },
  { number: 49, title: "Debugging", partId: 10 },
  { number: 50, title: "Testing", partId: 10 },
  { number: 51, title: "Clean Python Style", partId: 10 },
  { number: 52, title: "Performance Basics", partId: 10 },
  { number: 53, title: "Memory and Object Model", partId: 10 },
  { number: 54, title: "Python Execution Model", partId: 11 },
  { number: 55, title: "Advanced OOP", partId: 11 },
  { number: 56, title: "Concurrency Basics", partId: 11 },
  { number: 57, title: "Async Python", partId: 11 },
  { number: 58, title: "Advanced Packaging Preview", partId: 11 },
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
