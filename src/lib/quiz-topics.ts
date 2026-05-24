import { getAllQuizzes, getQuizByChapter, type ChapterQuiz } from "./quizzes";

/** URL slug under /python/quiz/{slug}/ */
export type QuizTopic = {
  slug: string;
  title: string;
  chapter: number;
  description: string;
};

/** One quiz topic per curriculum chapter (31 = mini programs). */
export const QUIZ_TOPICS: QuizTopic[] = [
  {
    slug: "what-is-python",
    chapter: 1,
    title: "What is Python?",
    description: "Why Python and how the course works.",
  },
  {
    slug: "print-comments-errors",
    chapter: 2,
    title: "Print, Comments, and Errors",
    description: "print(), comments, and reading syntax errors.",
  },
  {
    slug: "variables",
    chapter: 3,
    title: "Variables",
    description: "Names, assignment, and using variables.",
  },
  {
    slug: "input-and-conversion",
    chapter: 4,
    title: "Input and Type Conversion",
    description: "input() and converting strings to numbers.",
  },
  {
    slug: "data-types",
    chapter: 5,
    title: "Data Types",
    description: "Types, isinstance, and mutability.",
  },
  {
    slug: "numbers-and-operators",
    chapter: 6,
    title: "Numbers and Operators",
    description: "int, float, and arithmetic operators.",
  },
  {
    slug: "strings",
    chapter: 7,
    title: "Strings",
    description: "Create, slice, and transform text.",
  },
  {
    slug: "booleans-and-conditions",
    chapter: 8,
    title: "Booleans and Conditions",
    description: "True/False, comparisons, if/elif/else.",
  },
  {
    slug: "loops",
    chapter: 9,
    title: "Loops",
    description: "for, while, range, and loop patterns.",
  },
  {
    slug: "lists",
    chapter: 10,
    title: "Lists",
    description: "Ordered mutable sequences and methods.",
  },
  {
    slug: "tuples",
    chapter: 11,
    title: "Tuples",
    description: "Immutable sequences and unpacking.",
  },
  {
    slug: "sets",
    chapter: 12,
    title: "Sets",
    description: "Unique items and set operations.",
  },
  {
    slug: "dictionaries",
    chapter: 13,
    title: "Dictionaries",
    description: "Key–value maps and dict methods.",
  },
  {
    slug: "functions",
    chapter: 14,
    title: "Functions",
    description: "def, arguments, return, and docstrings.",
  },
  { slug: "scope", chapter: 15, title: "Scope", description: "Local vs global names." },
  {
    slug: "error-handling",
    chapter: 16,
    title: "Error Handling",
    description: "try/except, raise, and tracebacks.",
  },
  {
    slug: "files",
    chapter: 17,
    title: "Files",
    description: "Read, write, and pathlib.",
  },
  {
    slug: "modules",
    chapter: 18,
    title: "Modules",
    description: "import and organize code in files.",
  },
  {
    slug: "packages-and-imports",
    chapter: 19,
    title: "Packages and Imports",
    description: "Packages, venv, and requirements.txt.",
  },
  {
    slug: "built-in-functions",
    chapter: 20,
    title: "Useful Built-in Functions",
    description: "len, sum, min, max, and more.",
  },
  {
    slug: "comprehensions",
    chapter: 21,
    title: "Comprehensions",
    description: "List, dict, and set comprehensions.",
  },
  {
    slug: "object-oriented-python",
    chapter: 22,
    title: "Object-Oriented Python",
    description: "Classes, inheritance, and dunder methods.",
  },
  {
    slug: "advanced-functions",
    chapter: 23,
    title: "Advanced Functions",
    description: "*args, **kwargs, lambda, and functools.",
  },
  {
    slug: "iterators-and-generators",
    chapter: 24,
    title: "Iterators and Generators",
    description: "yield, iterators, and itertools.",
  },
  {
    slug: "decorators",
    chapter: 25,
    title: "Decorators",
    description: "Wrap functions to add behavior.",
  },
  {
    slug: "type-hints",
    chapter: 26,
    title: "Type Hints",
    description: "Annotations and optional mypy checks.",
  },
  {
    slug: "standard-library",
    chapter: 27,
    title: "Python Standard Library",
    description: "collections, json, datetime, logging, and more.",
  },
  {
    slug: "debugging",
    chapter: 28,
    title: "Debugging Python Code",
    description: "pdb, profiling, and timeit.",
  },
  {
    slug: "testing",
    chapter: 29,
    title: "Testing Python Code",
    description: "assert, pytest, and unittest.",
  },
  {
    slug: "clean-code",
    chapter: 30,
    title: "Writing Clean Python",
    description: "Style tools and readable code habits.",
  },
  {
    slug: "mini-programs",
    chapter: 31,
    title: "Python Mini Programs",
    description: "Small programs that combine what you learned.",
  },
];

const bySlug = new Map(QUIZ_TOPICS.map((t) => [t.slug, t]));
const byChapter = new Map(QUIZ_TOPICS.map((t) => [t.chapter, t]));

export function getQuizTopic(slug: string): QuizTopic | undefined {
  return bySlug.get(slug);
}

/**
 * Map 59-chapter lesson numbers to legacy quiz chapter keys (1–31).
 * Multiple tutorial chapters can share one quiz until quizzes are split.
 */
function quizChapterForLessonChapter(chapter: number): number | undefined {
  if (chapter <= 0) return undefined;
  if (chapter === 1) return 1;
  if (chapter >= 2 && chapter <= 5) return 2;
  if (chapter === 6) return 3;
  if (chapter >= 7 && chapter <= 8) return 4;
  if (chapter === 9) return 5;
  if (chapter >= 10 && chapter <= 11) return 6;
  if (chapter === 12) return 7;
  if (chapter >= 13 && chapter <= 14) return 8;
  if (chapter === 15) return 10;
  if (chapter >= 16 && chapter <= 17) return 9;
  if (chapter === 18) return 11;
  if (chapter === 19) return 12;
  if (chapter === 20) return 13;
  if (chapter === 21) return 21;
  if (chapter === 22) return 14;
  if (chapter === 23) return 15;
  if (chapter === 24) return 23;
  if (chapter === 25) return 16;
  if (chapter >= 26 && chapter <= 27) return 17;
  if (chapter === 28) return 18;
  if (chapter === 29) return 20;
  if (chapter >= 30 && chapter <= 34) return 27;
  if (chapter === 35) return 19;
  if (chapter >= 36 && chapter <= 39) return 22;
  if (chapter === 40) return 27;
  if (chapter === 41) return 26;
  if (chapter >= 42 && chapter <= 43) return 24;
  if (chapter === 44) return 25;
  if (chapter >= 45 && chapter <= 46) return 23;
  if (chapter === 47 || chapter === 48) return 27;
  if (chapter === 49) return 23;
  if (chapter === 50 || chapter === 53) return 28;
  if (chapter === 51) return 29;
  if (chapter === 52) return 30;
  if (chapter === 54) return 5;
  return undefined;
}

export function getQuizTopicForChapter(chapter: number): QuizTopic | undefined {
  const quizChapter = quizChapterForLessonChapter(chapter);
  if (quizChapter == null) return undefined;
  return byChapter.get(quizChapter);
}

export function quizUrl(slug: string): string {
  return `/python/quiz/${slug}/`;
}

export function getQuizExam(topic: QuizTopic): ChapterQuiz | undefined {
  return getQuizByChapter(topic.chapter);
}

export function getPublishedQuizTopics(): QuizTopic[] {
  const published = new Set(getAllQuizzes().map((q) => q.chapter));
  return QUIZ_TOPICS.filter((t) => published.has(t.chapter));
}
