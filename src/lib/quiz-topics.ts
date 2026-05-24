import {
  getAllPracticeExams,
  getPracticeExam,
  type PracticeExam,
} from "./practice-exams";

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

export function getQuizTopicForChapter(chapter: number): QuizTopic | undefined {
  return byChapter.get(chapter);
}

export function quizUrl(slug: string): string {
  return `/python/quiz/${slug}/`;
}

export function getQuizExam(topic: QuizTopic): PracticeExam | undefined {
  return getPracticeExam(topic.chapter);
}

export function getPublishedQuizTopics(): QuizTopic[] {
  const published = new Set(getAllPracticeExams().map((e) => e.chapter));
  return QUIZ_TOPICS.filter((t) => published.has(t.chapter));
}
