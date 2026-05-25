#!/usr/bin/env node
/**
 * Build docs/curriculum-order.json for the 59-chapter curriculum.
 * Run: node scripts/build-curriculum-v59.mjs && npm run sync:curriculum
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** slug -> { chapter, section? } — section = subtopic label in sidebar/index */
const SLUG_MAP = {
  "what-is-programming": { chapter: 1 },
  "what-is-code": { chapter: 1 },
  "what-is-python": { chapter: 1 },
  "what-is-python-used-for": { chapter: 1 },
  "why-learn-python": { chapter: 1 },
  "how-to-study-python": { chapter: 1 },

  "code-basics": { chapter: 2 },
  "code-order": { chapter: 2 },
  print: { chapter: 2 },
  "print-values": { chapter: 2 },
  "escape-characters": { chapter: 2 },
  "code-mistakes": { chapter: 2 },
  "what-are-comments": { chapter: 3 },
  "single-line-comments": { chapter: 3 },
  "commenting-out-code": { chapter: 3 },
  "good-comments-vs-bad": { chapter: 3 },
  "errors-are-normal": { chapter: 4 },
  "what-is-syntax-error": { chapter: 4 },
  "nameerror-preview": { chapter: 4 },
  "typeerror-preview": { chapter: 4 },
  "reading-error-messages": { chapter: 4 },
  "how-to-fix-beginner-errors": { chapter: 4 },

  "what-is-a-variable": { chapter: 5 },
  "assignment-operator": { chapter: 5 },
  "variable-names": { chapter: 5 },
  "updating-variable-values": { chapter: 5 },
  "variables-with-print": { chapter: 5 },
  "common-variable-mistakes": { chapter: 5 },

  "what-is-input": { chapter: 6 },
  "the-input-function": { chapter: 6 },
  "storing-input-in-variable": { chapter: 6 },
  "input-always-returns-text": { chapter: 6 },
  "simple-input-mistakes": { chapter: 6 },

  "what-is-type-conversion": { chapter: 7 },
  "convert-input": { chapter: 7 },
  "int-float-conversion": { chapter: 7 },
  "str-bool-conversion": { chapter: 7 },
  "checking-types": { chapter: 7 },
  "conversion-mistakes": { chapter: 7 },

  "arithmetic-operators": { chapter: 8, section: "Arithmetic operators" },
  "assignment-operators": { chapter: 8, section: "Assignment operators" },
  "operator-precedence": { chapter: 8, section: "Operator precedence" },

  "what-are-data-types-in-python": { chapter: 9 },
  "checking-types-with-type": { chapter: 9 },
  "checking-types-with-isinstance": { chapter: 9 },
  "common-data-type-mistakes": { chapter: 9 },

  "integers-floats": { chapter: 10, section: "Integers, floats, and complex" },

  strings: { chapter: 11, section: "What is a string?" },
  "string-slicing": { chapter: 11, section: "Indexing and slicing" },
  "string-upper-lower": { chapter: 11, section: "Case methods" },
  "string-strip": { chapter: 11, section: "Cleaning methods" },
  "string-split": { chapter: 11, section: "Splitting and joining" },
  "string-join": { chapter: 11, section: "Splitting and joining" },
  "string-find-replace": { chapter: 11, section: "Searching and replacing" },
  "string-count": { chapter: 11, section: "Searching and replacing" },
  "string-startswith": { chapter: 11, section: "Checking start or end" },
  "string-in": { chapter: 11, section: "Membership" },
  "string-format": { chapter: 11, section: "f-strings" },
  "name-formatter-project": { chapter: 11, section: "Mini project" },
  "word-counter-project": { chapter: 11, section: "Mini project" },

  booleans: { chapter: 12, section: "True and False" },
  "truthy-falsy": { chapter: 12, section: "Truthy and falsy values" },
  comparisons: { chapter: 12, section: "Comparison operators" },
  "not-operator": { chapter: 12, section: "Logical operators" },
  "and-or": { chapter: 12, section: "Logical operators" },
  "membership-identity": { chapter: 12, section: "Membership and identity" },

  "if-indentation": { chapter: 13, section: "if statements" },
  "elif-else": { chapter: 13, section: "elif and else" },
  "nested-if": { chapter: 13, section: "Nested if" },
  "login-checker-project": { chapter: 13, section: "Mini project" },
  "grade-checker-project": { chapter: 13, section: "Mini project" },

  "lists-intro": { chapter: 14, section: "Creating lists" },
  "list-indexing": { chapter: 14, section: "Indexing and slicing" },
  "list-slicing": { chapter: 14, section: "Indexing and slicing" },
  "list-append": { chapter: 14, section: "Adding items" },
  "list-extend": { chapter: 14, section: "Adding items" },
  "list-append-vs-extend": { chapter: 14, section: "Adding items" },
  "list-insert": { chapter: 14, section: "Adding items" },
  "list-remove": { chapter: 14, section: "Removing items" },
  "list-pop": { chapter: 14, section: "Removing items" },
  "list-del": { chapter: 14, section: "Removing items" },
  "list-clear": { chapter: 14, section: "Removing items" },
  "list-sort": { chapter: 14, section: "Sorting and reversing" },
  "list-reverse": { chapter: 14, section: "Sorting and reversing" },
  "list-copy": { chapter: 14, section: "Copying lists" },
  "list-index-count": { chapter: 14, section: "Finding items" },

  "while-loops": { chapter: 15, section: "while loops" },
  "for-loops": { chapter: 15, section: "for loops" },
  "range-function": { chapter: 15, section: "range()" },
  "break-continue": { chapter: 15, section: "break and continue" },
  "loop-else": { chapter: 15, section: "else with loops" },
  "infinite-loops": { chapter: 15, section: "Infinite loops" },
  "nested-loops": { chapter: 15, section: "Nested loops" },
  "list-loops": { chapter: 15, section: "Looping lists" },
  "list-enumerate": { chapter: 15, section: "Looping lists" },
  "list-zip": { chapter: 15, section: "Looping lists" },
  "guessing-game-project": { chapter: 15, section: "Mini project" },
  "random-guessing-game": { chapter: 15, section: "Mini project" },
  "todo-list-project": { chapter: 15, section: "Mini project" },

  "loop-patterns": { chapter: 16, section: "Common loop patterns" },

  "tuples-intro": { chapter: 17, section: "Creating tuples" },
  "tuple-unpacking": { chapter: 17, section: "Tuple unpacking" },
  "tuple-immutability": { chapter: 17, section: "Tuple immutability" },
  "tuple-one-item": { chapter: 17, section: "Single-item tuple" },
  "namedtuple-preview": { chapter: 17, section: "namedtuple preview" },

  "sets-intro": { chapter: 18, section: "Creating sets" },
  "set-add-remove": { chapter: 18, section: "Adding and removing" },
  "set-empty-set": { chapter: 18, section: "Empty set" },
  "set-operations": { chapter: 18, section: "Set operations" },
  "frozenset-basics": { chapter: 18, section: "frozenset" },
  "set-comprehensions": { chapter: 18, section: "Set comprehensions" },

  "dict-intro": { chapter: 19, section: "Creating dictionaries" },
  "dict-key-rules": { chapter: 19, section: "Key rules" },
  "dict-access": { chapter: 19, section: "Accessing values" },
  "dict-get": { chapter: 19, section: "Accessing values" },
  "dict-setdefault": { chapter: 19, section: "Useful methods" },
  "dict-keys": { chapter: 19, section: "Dictionary views" },
  "dict-values": { chapter: 19, section: "Dictionary views" },
  "dict-items": { chapter: 19, section: "Looping dictionaries" },
  "dict-pop-update": { chapter: 19, section: "Removing and merging" },
  "dict-popitem": { chapter: 19, section: "Removing and merging" },
  "dict-nested": { chapter: 19, section: "Nested dictionaries" },
  "dict-loops": { chapter: 19, section: "Looping dictionaries" },
  "dict-comprehensions": { chapter: 19, section: "Dictionary comprehensions" },
  "contact-book-project": { chapter: 19, section: "Mini project" },

  "list-comprehensions": { chapter: 20, section: "List comprehensions" },
  "nested-list-comprehensions": { chapter: 20, section: "Nested list comprehensions" },

  "functions-intro": { chapter: 21, section: "Why functions exist" },
  "function-arguments": { chapter: 21, section: "Parameters and arguments" },
  "function-default-args": { chapter: 21, section: "Default arguments" },
  "function-return": { chapter: 21, section: "Return values" },
  "print-vs-return": { chapter: 21, section: "print vs return" },
  "function-docstrings": { chapter: 21, section: "Docstrings" },

  "function-scope": { chapter: 22, section: "Local and global scope" },

  "function-args-kwargs": { chapter: 23, section: "*args and **kwargs" },
  "function-keyword-only": { chapter: 23, section: "Keyword arguments" },
  "function-unpacking-calls": { chapter: 23, section: "Unpacking calls" },
  "lambda-functions": { chapter: 23, section: "Lambda functions" },
  "builtin-functions": { chapter: 28, section: "Built-in helpers" },
  "functools-lru-cache": { chapter: 48, section: "lru_cache" },

  tracebacks: { chapter: 24, section: "Tracebacks" },
  "try-except": { chapter: 24, section: "try and except" },
  "try-else-finally": { chapter: 24, section: "else and finally" },
  "raise-statement": { chapter: 24, section: "raise" },
  "common-exceptions": { chapter: 24, section: "Common exceptions" },
  "except-multiple-types": { chapter: 24, section: "Multiple exceptions" },
  "exception-chaining": { chapter: 24, section: "Exception chaining" },
  "safe-calculator-project": { chapter: 24, section: "Mini project" },

  "file-paths-modes": { chapter: 25, section: "File paths and modes" },
  "read-files": { chapter: 25, section: "Reading files" },
  "file-readlines-encoding": { chapter: 25, section: "Reading files" },
  "write-files": { chapter: 25, section: "Writing files" },
  "file-append-mode": { chapter: 25, section: "Appending files" },
  "context-managers-custom": { chapter: 44, section: "Context managers" },
  "notes-app-project": { chapter: 25, section: "Mini project" },

  "pathlib-basics": { chapter: 26, section: "Path object" },
  "pathlib-glob-files": { chapter: 26, section: "Listing files" },
  "pathlib-relative-absolute": { chapter: 26, section: "Relative and absolute paths" },
  "shutil-file-ops": { chapter: 26, section: "File operations" },

  "modules-intro": { chapter: 27, section: "import" },
  "import-from-as": { chapter: 27, section: "from import and as" },
  "main-module-guard": { chapter: 27, section: '__name__ == "__main__"' },
  "sys-argv-basics": { chapter: 27, section: "sys.argv" },
  "argparse-cli": { chapter: 27, section: "argparse preview" },
  "os-environ-vars": { chapter: 27, section: "os.environ" },
  "secrets-token-safety": { chapter: 27, section: "secrets module" },
  "subprocess-run-safety": { chapter: 27, section: "subprocess preview" },

  "collections-preview": { chapter: 29, section: "collections module" },
  "enum-module-preview": { chapter: 29, section: "enum module" },
  "copy-deepcopy": { chapter: 53, section: "Deep copy" },
  "match-case-preview": { chapter: 29, section: "match case preview" },
  "logging-basic": { chapter: 29, section: "logging" },

  "json-python": { chapter: 30, section: "JSON basics" },
  "json-todo-project": { chapter: 30, section: "Mini project" },

  "csv-read-write": { chapter: 31, section: "CSV basics" },
  "configparser-ini-files": { chapter: 31, section: "INI files preview" },

  "regex-basics": { chapter: 32, section: "Regular expressions" },

  "datetime-basics": { chapter: 33, section: "datetime module" },

  "python-packages": { chapter: 34, section: "What is a package?" },
  "venv-and-requirements": { chapter: 34, section: "venv and pip" },

  "classes-intro": { chapter: 35, section: "Classes and objects" },
  "class-init-self": { chapter: 35, section: "__init__ and self" },
  "class-instance-attributes": { chapter: 35, section: "Instance attributes" },
  "class-methods": { chapter: 35, section: "Methods" },

  "classstaticmethod-classmethod": {
    chapter: 36,
    section: "classmethod and staticmethod",
  },
  "class-property-decorator": { chapter: 36, section: "@property" },
  "class-str-repr": { chapter: 36, section: "__str__ and __repr__" },

  inheritance: { chapter: 37, section: "Inheritance" },
  "super-inheritance": { chapter: 37, section: "super()" },

  "dunder-methods-magic": { chapter: 38, section: "Dunder methods" },

  "dataclasses-preview": { chapter: 39, section: "Dataclasses" },

  "type-hints-intro": { chapter: 40, section: "Type hints basics" },
  "type-hints-depth": { chapter: 40, section: "Advanced type hints" },
  "typing-typeddict-protocol": { chapter: 40, section: "TypedDict and Protocol" },
  "mypy-type-checking": { chapter: 40, section: "mypy" },

  "iterators-protocol": { chapter: 41, section: "Iterators" },
  "generators-yield-intro": { chapter: 42, section: "Generators" },
  "itertools-preview": { chapter: 47, section: "itertools" },

  "decorators-preview": { chapter: 43, section: "Decorators" },

  "debugging-help-dir": { chapter: 49, section: "help() and dir()" },
  pdb: null,
  "pdb-debugger": { chapter: 49, section: "pdb" },

  "assert-testing-intro": { chapter: 50, section: "assert" },
  "pytest-basics": { chapter: 50, section: "pytest" },
  "unittest-module": { chapter: 50, section: "unittest" },

  "code-quality-tools": { chapter: 51, section: "Ruff and Black" },

  "cprofile-performance": { chapter: 52, section: "Profiling" },
  "timeit-benchmark": { chapter: 52, section: "timeit" },

  "quiz-app-project": { chapter: 51, section: "Mini programs" },
  "personality-quiz-project": { chapter: 51, section: "Mini programs" },
  "multi-file-cli-project": { chapter: 34, section: "Multi-file CLI" },
};

// Fix typo pdb key
delete SLUG_MAP.pdb;

const CHAPTER_TITLES = {
  1: "What Is Python?",
  2: "Python Code Basics",
  3: "Comments",
  4: "Beginner Errors",
  5: "Variables",
  6: "Input",
  7: "Type Conversion",
  8: "Operators",
  9: "Data Types",
  10: "Numbers",
  11: "Strings",
  12: "Booleans",
  13: "Conditions",
  14: "Lists",
  15: "Loops",
  16: "Loop Patterns",
  17: "Tuples",
  18: "Sets",
  19: "Dictionaries",
  20: "Comprehensions",
  21: "Functions",
  22: "Scope",
  23: "Advanced Function Concepts",
  24: "Errors and Exceptions",
  25: "Files",
  26: "Pathlib",
  27: "Modules",
  28: "Built-in Functions",
  29: "Standard Library Essentials",
  30: "JSON",
  31: "CSV",
  32: "Regex",
  33: "Date and Time",
  34: "Packages, Pip, and Virtual Environments",
  35: "Classes and Objects",
  36: "Class Design",
  37: "Inheritance",
  38: "Dunder Methods",
  39: "Dataclasses",
  40: "Type Hints",
  41: "Iterators",
  42: "Generators",
  43: "Decorators",
  44: "Context Managers",
  45: "Functional Tools",
  46: "collections Module",
  47: "itertools",
  48: "functools",
  49: "Debugging",
  50: "Testing",
  51: "Clean Python Style",
  52: "Performance Basics",
  53: "Memory and Object Model",
  54: "Python Execution Model",
  55: "Advanced OOP",
  56: "Concurrency Basics",
  57: "Async Python",
  58: "Advanced Packaging Preview",
};

const PART_BY_CHAPTER = [
  [1, 4, 1],
  [5, 7, 2],
  [8, 11, 3],
  [12, 13, 4],
  [14, 20, 5],
  [21, 24, 6],
  [25, 34, 7],
  [35, 39, 8],
  [40, 48, 9],
  [49, 53, 10],
  [54, 58, 11],
];

const PART_TITLES = {
  1: "Absolute beginner",
  2: "Variables and input",
  3: "Types, numbers, and strings",
  4: "Booleans and conditions",
  5: "Collections and loops",
  6: "Functions",
  7: "Files, modules, and the standard library",
  8: "Object-oriented Python",
  9: "Advanced Python",
  10: "Debugging, testing, and clean code",
  11: "Expert topics (coming later)",
};

function partForChapter(ch) {
  for (const [from, to, id] of PART_BY_CHAPTER) {
    if (ch >= from && ch <= to) return { id, title: PART_TITLES[id] };
  }
  return { id: 0, title: "" };
}

/**
 * Global lesson order: chapter 1 → 59, with explicit order inside each chapter.
 * Prev/Next and the sidebar stay in sync — one concept builds on the last.
 */
const CHAPTER_LESSON_ORDER = {
  1: [
    "what-is-programming",
    "what-is-code",
    "what-is-python",
    "what-is-python-used-for",
    "why-learn-python",
    "how-to-study-python",
  ],
  2: [
    "code-basics",
    "code-order",
    "print",
    "print-values",
    "escape-characters",
    "code-mistakes",
  ],
  3: [
    "what-are-comments",
    "single-line-comments",
    "commenting-out-code",
    "good-comments-vs-bad",
  ],
  4: [
    "errors-are-normal",
    "what-is-syntax-error",
    "nameerror-preview",
    "typeerror-preview",
    "reading-error-messages",
    "how-to-fix-beginner-errors",
  ],
  5: [
    "what-is-a-variable",
    "assignment-operator",
    "variable-names",
    "updating-variable-values",
    "variables-with-print",
    "common-variable-mistakes",
  ],
  6: [
    "what-is-input",
    "the-input-function",
    "storing-input-in-variable",
    "input-always-returns-text",
    "simple-input-mistakes",
  ],
  7: [
    "what-is-type-conversion",
    "convert-input",
    "int-float-conversion",
    "str-bool-conversion",
    "checking-types",
    "conversion-mistakes",
  ],
  8: [
    "arithmetic-operators",
    "assignment-operators",
    "operator-precedence",
  ],
  9: [
    "what-are-data-types-in-python",
    "checking-types-with-type",
    "checking-types-with-isinstance",
    "common-data-type-mistakes",
  ],
  10: ["integers-floats"],
  11: [
    "strings",
    "string-upper-lower",
    "string-strip",
    "string-split",
    "string-join",
    "string-find-replace",
    "string-count",
    "string-startswith",
    "string-in",
    "string-format",
    "string-slicing",
    "name-formatter-project",
    "word-counter-project",
  ],
  12: [
    "booleans",
    "truthy-falsy",
    "comparisons",
    "not-operator",
    "and-or",
    "membership-identity",
  ],
  13: [
    "if-indentation",
    "elif-else",
    "nested-if",
    "login-checker-project",
    "grade-checker-project",
  ],
  14: [
    "lists-intro",
    "list-indexing",
    "list-slicing",
    "list-append",
    "list-extend",
    "list-append-vs-extend",
    "list-insert",
    "list-remove",
    "list-pop",
    "list-del",
    "list-clear",
    "list-sort",
    "list-reverse",
    "list-copy",
    "list-index-count",
  ],
  15: [
    "while-loops",
    "for-loops",
    "range-function",
    "break-continue",
    "loop-else",
    "infinite-loops",
    "nested-loops",
    "list-loops",
    "list-enumerate",
    "list-zip",
    "guessing-game-project",
    "random-guessing-game",
    "todo-list-project",
  ],
  16: ["loop-patterns"],
};

function slugsInMapOrderForChapter(chapter) {
  return Object.keys(SLUG_MAP).filter((slug) => SLUG_MAP[slug]?.chapter === chapter);
}

function buildPedagogicalOrder(allSlugs) {
  const index = new Map();
  let n = 0;
  for (let chapter = 1; chapter <= 59; chapter++) {
    const listed = CHAPTER_LESSON_ORDER[chapter] ?? slugsInMapOrderForChapter(chapter);
    for (const slug of listed) {
      if (!allSlugs.includes(slug) || !SLUG_MAP[slug]) continue;
      if (!index.has(slug)) index.set(slug, n++);
    }
  }
  for (const slug of allSlugs) {
    if (!index.has(slug)) index.set(slug, n++);
  }
  return [...allSlugs].sort((a, b) => index.get(a) - index.get(b));
}

const current = JSON.parse(
  readFileSync(join(root, "docs/curriculum-order.json"), "utf8"),
);
const EXTRA_SLUGS = [
  "escape-characters",
  "what-is-input",
  "the-input-function",
  "storing-input-in-variable",
  "input-always-returns-text",
  "simple-input-mistakes",
  "what-is-type-conversion",
  "convert-input",
  "int-float-conversion",
  "str-bool-conversion",
  "checking-types",
  "conversion-mistakes",
];
const allSlugs = [
  ...new Set([...current.lessons.map((l) => l.slug), ...EXTRA_SLUGS]),
].filter((slug) => SLUG_MAP[slug]);
const orderSlugs = buildPedagogicalOrder(allSlugs);

const missing = orderSlugs.filter((s) => !SLUG_MAP[s]);
if (missing.length) {
  console.error("Missing SLUG_MAP entries:", missing.join(", "));
  process.exit(1);
}

const lessons = orderSlugs.map((slug) => {
  const m = SLUG_MAP[slug];
  const chapterTitle = CHAPTER_TITLES[m.chapter];
  const part = partForChapter(m.chapter);
  const entry = {
    slug,
    chapter: m.chapter,
    chapterTitle,
    part: part.id,
    partTitle: part.title,
  };
  if (m.section) entry.section = m.section;
  return entry;
});

const out = {
  version: 13,
  description:
    "59-chapter curriculum; global order follows chapter 1→59 (basics → types → numbers → operators → …). Run: node scripts/build-curriculum-v59.mjs && npm run sync:curriculum",
  lessons,
};

writeFileSync(
  join(root, "docs/curriculum-order.json"),
  JSON.stringify(out, null, 2) + "\n",
);
console.log(
  `Wrote ${lessons.length} lessons to docs/curriculum-order.json (v${out.version})`,
);
