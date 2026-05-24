import { getAllPracticeExams, getPracticeExam, type PracticeExam } from "./practice-exams";

/** URL slug under /python/quiz/{slug}/ */
export type QuizTopic = {
  slug: string;
  title: string;
  chapter: number;
  description: string;
};

/** Chapter quizzes — slug is stable for SEO and nav. */
export const QUIZ_TOPICS: QuizTopic[] = [
  { slug: "getting-started", chapter: 1, title: "Getting Started", description: "Print, syntax, and first steps." },
  { slug: "variables", chapter: 2, title: "Variables", description: "Names, assignment, and input." },
  { slug: "data-types", chapter: 3, title: "Data Types", description: "str, int, float, bool, and type checks." },
  { slug: "operators", chapter: 4, title: "Operators", description: "Arithmetic, comparison, and logic." },
  { slug: "if-statements", chapter: 5, title: "If Statements", description: "Conditions and branches." },
  { slug: "loops", chapter: 6, title: "Loops", description: "for, while, and range." },
  { slug: "lists", chapter: 7, title: "Lists", description: "Indexing, methods, and comprehensions." },
  { slug: "tuples", chapter: 8, title: "Tuples", description: "Immutable sequences and unpacking." },
  { slug: "sets", chapter: 9, title: "Sets", description: "Unique items and set operations." },
  { slug: "dictionaries", chapter: 10, title: "Dictionaries", description: "Keys, values, and dict methods." },
  { slug: "functions", chapter: 11, title: "Functions", description: "def, arguments, return, and scope intro." },
  { slug: "modules", chapter: 12, title: "Modules", description: "import, packages, and the standard layout." },
  { slug: "error-handling", chapter: 13, title: "Error Handling", description: "try/except, raise, and tracebacks." },
  { slug: "classes", chapter: 14, title: "Classes", description: "OOP, inheritance, and dunder methods." },
  { slug: "files", chapter: 15, title: "Files", description: "Read/write files and pathlib." },
  { slug: "debugging", chapter: 16, title: "Debugging", description: "pdb, profiling, and timing." },
  { slug: "testing", chapter: 17, title: "Testing", description: "assert, pytest, and unittest." },
  { slug: "functional-python", chapter: 18, title: "Functional Python", description: "lambda, decorators, and itertools." },
  { slug: "standard-library", chapter: 19, title: "Standard Library", description: "collections, enum, math, and copy." },
  { slug: "json", chapter: 20, title: "JSON", description: "json module and saving data." },
  { slug: "dataclasses-dates", chapter: 21, title: "Dataclasses & Dates", description: "dataclass, datetime, and match." },
  { slug: "logging-regex", chapter: 22, title: "Logging & Regex", description: "logging module and re patterns." },
  { slug: "mini-programs", chapter: 25, title: "Python Mini Programs", description: "Apply concepts in small programs." },
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
