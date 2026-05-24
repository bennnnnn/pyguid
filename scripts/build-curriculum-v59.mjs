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
  "what-is-python": { chapter: 1, section: "What is Python?" },

  "top-to-bottom": { chapter: 2, section: "Top-to-bottom execution" },
  "first-print": { chapter: 2, section: "The print function" },
  "escape-characters": { chapter: 2, section: "Escape characters" },
  comments: { chapter: 4, section: "Single-line comments" },
  "syntax-errors": { chapter: 5, section: "Syntax errors" },

  "creating-variables": { chapter: 6, section: "Creating variables" },
  "naming-rules": { chapter: 6, section: "Variable names" },
  "updating-values": { chapter: 6, section: "Updating values" },
  "variables-in-print": { chapter: 6, section: "Printing variables" },
  "multiple-assignment": { chapter: 6, section: "Multiple assignment" },

  "input-basics": { chapter: 7, section: "What is input()?" },
  "input-conversion": { chapter: 8, section: "Converting user input" },

  "data-types-overview": { chapter: 9, section: "Core data types" },
  "type-function": { chapter: 9, section: "type()" },
  "isinstance-basics": { chapter: 9, section: "isinstance()" },
  "none-type": { chapter: 9, section: "None" },
  "mutable-immutable": { chapter: 9, section: "Mutable vs immutable" },

  "integers-floats": { chapter: 10, section: "Integers and floats" },
  "math-random-module": { chapter: 10, section: "math and random preview" },

  "arithmetic-operators": { chapter: 11, section: "Arithmetic operators" },
  "assignment-operators": { chapter: 11, section: "Assignment operators" },
  "operator-precedence": { chapter: 11, section: "Operator precedence" },
  "tip-calculator-project": { chapter: 11, section: "Mini project" },

  strings: { chapter: 12, section: "What is a string?" },
  "string-slicing": { chapter: 12, section: "Indexing and slicing" },
  "string-upper-lower": { chapter: 12, section: "Case methods" },
  "string-strip": { chapter: 12, section: "Cleaning methods" },
  "string-split": { chapter: 12, section: "Splitting and joining" },
  "string-join": { chapter: 12, section: "Splitting and joining" },
  "string-find-replace": { chapter: 12, section: "Searching and replacing" },
  "string-count": { chapter: 12, section: "Searching and replacing" },
  "string-startswith": { chapter: 12, section: "Checking start or end" },
  "string-in": { chapter: 12, section: "Membership" },
  "string-format": { chapter: 12, section: "f-strings" },
  "name-formatter-project": { chapter: 12, section: "Mini project" },
  "word-counter-project": { chapter: 12, section: "Mini project" },

  booleans: { chapter: 13, section: "True and False" },
  "truthy-falsy": { chapter: 13, section: "Truthy and falsy values" },
  comparisons: { chapter: 13, section: "Comparison operators" },
  "not-operator": { chapter: 13, section: "Logical operators" },
  "and-or": { chapter: 13, section: "Logical operators" },
  "membership-identity": { chapter: 13, section: "Membership and identity" },

  "if-indentation": { chapter: 14, section: "if statements" },
  "elif-else": { chapter: 14, section: "elif and else" },
  "nested-if": { chapter: 14, section: "Nested if" },
  "login-checker-project": { chapter: 14, section: "Mini project" },
  "grade-checker-project": { chapter: 14, section: "Mini project" },

  "lists-intro": { chapter: 15, section: "Creating lists" },
  "list-indexing": { chapter: 15, section: "Indexing and slicing" },
  "list-slicing": { chapter: 15, section: "Indexing and slicing" },
  "list-append": { chapter: 15, section: "Adding items" },
  "list-extend": { chapter: 15, section: "Adding items" },
  "list-append-vs-extend": { chapter: 15, section: "Adding items" },
  "list-insert": { chapter: 15, section: "Adding items" },
  "list-remove": { chapter: 15, section: "Removing items" },
  "list-pop": { chapter: 15, section: "Removing items" },
  "list-del": { chapter: 15, section: "Removing items" },
  "list-clear": { chapter: 15, section: "Removing items" },
  "list-sort": { chapter: 15, section: "Sorting and reversing" },
  "list-reverse": { chapter: 15, section: "Sorting and reversing" },
  "list-copy": { chapter: 15, section: "Copying lists" },
  "list-index-count": { chapter: 15, section: "Finding items" },

  "while-loops": { chapter: 16, section: "while loops" },
  "for-loops": { chapter: 16, section: "for loops" },
  "range-function": { chapter: 16, section: "range()" },
  "break-continue": { chapter: 16, section: "break and continue" },
  "loop-else": { chapter: 16, section: "else with loops" },
  "infinite-loops": { chapter: 16, section: "Infinite loops" },
  "nested-loops": { chapter: 16, section: "Nested loops" },
  "list-loops": { chapter: 16, section: "Looping lists" },
  "list-enumerate": { chapter: 16, section: "Looping lists" },
  "list-zip": { chapter: 16, section: "Looping lists" },
  "guessing-game-project": { chapter: 16, section: "Mini project" },
  "random-guessing-game": { chapter: 16, section: "Mini project" },
  "todo-list-project": { chapter: 16, section: "Mini project" },

  "loop-patterns": { chapter: 17, section: "Common loop patterns" },

  "tuples-intro": { chapter: 18, section: "Creating tuples" },
  "tuple-unpacking": { chapter: 18, section: "Tuple unpacking" },
  "tuple-immutability": { chapter: 18, section: "Tuple immutability" },
  "tuple-one-item": { chapter: 18, section: "Single-item tuple" },
  "namedtuple-preview": { chapter: 18, section: "namedtuple preview" },

  "sets-intro": { chapter: 19, section: "Creating sets" },
  "set-add-remove": { chapter: 19, section: "Adding and removing" },
  "set-empty-set": { chapter: 19, section: "Empty set" },
  "set-operations": { chapter: 19, section: "Set operations" },
  "frozenset-basics": { chapter: 19, section: "frozenset" },
  "set-comprehensions": { chapter: 19, section: "Set comprehensions" },

  "dict-intro": { chapter: 20, section: "Creating dictionaries" },
  "dict-key-rules": { chapter: 20, section: "Key rules" },
  "dict-access": { chapter: 20, section: "Accessing values" },
  "dict-get": { chapter: 20, section: "Accessing values" },
  "dict-setdefault": { chapter: 20, section: "Useful methods" },
  "dict-keys": { chapter: 20, section: "Dictionary views" },
  "dict-values": { chapter: 20, section: "Dictionary views" },
  "dict-items": { chapter: 20, section: "Looping dictionaries" },
  "dict-pop-update": { chapter: 20, section: "Removing and merging" },
  "dict-popitem": { chapter: 20, section: "Removing and merging" },
  "dict-nested": { chapter: 20, section: "Nested dictionaries" },
  "dict-loops": { chapter: 20, section: "Looping dictionaries" },
  "dict-comprehensions": { chapter: 20, section: "Dictionary comprehensions" },
  "contact-book-project": { chapter: 20, section: "Mini project" },

  "list-comprehensions": { chapter: 21, section: "List comprehensions" },
  "nested-list-comprehensions": { chapter: 21, section: "Nested list comprehensions" },

  "functions-intro": { chapter: 22, section: "Why functions exist" },
  "function-arguments": { chapter: 22, section: "Parameters and arguments" },
  "function-default-args": { chapter: 22, section: "Default arguments" },
  "function-return": { chapter: 22, section: "Return values" },
  "print-vs-return": { chapter: 22, section: "print vs return" },
  "function-docstrings": { chapter: 22, section: "Docstrings" },

  "function-scope": { chapter: 23, section: "Local and global scope" },

  "function-args-kwargs": { chapter: 24, section: "*args and **kwargs" },
  "function-keyword-only": { chapter: 24, section: "Keyword arguments" },
  "function-unpacking-calls": { chapter: 24, section: "Unpacking calls" },
  "lambda-functions": { chapter: 24, section: "Lambda functions" },
  "builtin-functions": { chapter: 29, section: "Built-in helpers" },
  "functools-lru-cache": { chapter: 49, section: "lru_cache" },

  tracebacks: { chapter: 25, section: "Tracebacks" },
  "try-except": { chapter: 25, section: "try and except" },
  "try-else-finally": { chapter: 25, section: "else and finally" },
  "raise-statement": { chapter: 25, section: "raise" },
  "common-exceptions": { chapter: 25, section: "Common exceptions" },
  "except-multiple-types": { chapter: 25, section: "Multiple exceptions" },
  "exception-chaining": { chapter: 25, section: "Exception chaining" },
  "safe-calculator-project": { chapter: 25, section: "Mini project" },

  "file-paths-modes": { chapter: 26, section: "File paths and modes" },
  "read-files": { chapter: 26, section: "Reading files" },
  "file-readlines-encoding": { chapter: 26, section: "Reading files" },
  "write-files": { chapter: 26, section: "Writing files" },
  "file-append-mode": { chapter: 26, section: "Appending files" },
  "context-managers-custom": { chapter: 45, section: "Context managers" },
  "notes-app-project": { chapter: 26, section: "Mini project" },

  "pathlib-basics": { chapter: 27, section: "Path object" },
  "pathlib-glob-files": { chapter: 27, section: "Listing files" },
  "pathlib-relative-absolute": { chapter: 27, section: "Relative and absolute paths" },
  "shutil-file-ops": { chapter: 27, section: "File operations" },

  "modules-intro": { chapter: 28, section: "import" },
  "import-from-as": { chapter: 28, section: "from import and as" },
  "main-module-guard": { chapter: 28, section: '__name__ == "__main__"' },
  "sys-argv-basics": { chapter: 28, section: "sys.argv" },
  "argparse-cli": { chapter: 28, section: "argparse preview" },
  "os-environ-vars": { chapter: 28, section: "os.environ" },
  "secrets-token-safety": { chapter: 28, section: "secrets module" },
  "subprocess-run-safety": { chapter: 28, section: "subprocess preview" },

  "collections-preview": { chapter: 30, section: "collections module" },
  "enum-module-preview": { chapter: 30, section: "enum module" },
  "copy-deepcopy": { chapter: 54, section: "Deep copy" },
  "match-case-preview": { chapter: 30, section: "match case preview" },
  "logging-basic": { chapter: 30, section: "logging" },

  "json-python": { chapter: 31, section: "JSON basics" },
  "json-todo-project": { chapter: 31, section: "Mini project" },

  "csv-read-write": { chapter: 32, section: "CSV basics" },
  "configparser-ini-files": { chapter: 32, section: "INI files preview" },

  "regex-basics": { chapter: 33, section: "Regular expressions" },

  "datetime-basics": { chapter: 34, section: "datetime module" },

  "python-packages": { chapter: 35, section: "What is a package?" },
  "venv-and-requirements": { chapter: 35, section: "venv and pip" },

  "classes-intro": { chapter: 36, section: "Classes and objects" },
  "class-init-self": { chapter: 36, section: "__init__ and self" },
  "class-instance-attributes": { chapter: 36, section: "Instance attributes" },
  "class-methods": { chapter: 36, section: "Methods" },

  "classstaticmethod-classmethod": { chapter: 37, section: "classmethod and staticmethod" },
  "class-property-decorator": { chapter: 37, section: "@property" },
  "class-str-repr": { chapter: 37, section: "__str__ and __repr__" },

  inheritance: { chapter: 38, section: "Inheritance" },
  "super-inheritance": { chapter: 38, section: "super()" },

  "dunder-methods-magic": { chapter: 39, section: "Dunder methods" },

  "dataclasses-preview": { chapter: 40, section: "Dataclasses" },

  "type-hints-intro": { chapter: 41, section: "Type hints basics" },
  "type-hints-depth": { chapter: 41, section: "Advanced type hints" },
  "typing-typeddict-protocol": { chapter: 41, section: "TypedDict and Protocol" },
  "mypy-type-checking": { chapter: 41, section: "mypy" },

  "iterators-protocol": { chapter: 42, section: "Iterators" },
  "generators-yield-intro": { chapter: 43, section: "Generators" },
  "itertools-preview": { chapter: 48, section: "itertools" },

  "decorators-preview": { chapter: 44, section: "Decorators" },

  "debugging-help-dir": { chapter: 50, section: "help() and dir()" },
  pdb: null,
  "pdb-debugger": { chapter: 50, section: "pdb" },

  "assert-testing-intro": { chapter: 51, section: "assert" },
  "pytest-basics": { chapter: 51, section: "pytest" },
  "unittest-module": { chapter: 51, section: "unittest" },

  "code-quality-tools": { chapter: 52, section: "Ruff and Black" },

  "cprofile-performance": { chapter: 53, section: "Profiling" },
  "timeit-benchmark": { chapter: 53, section: "timeit" },

  "quiz-app-project": { chapter: 52, section: "Mini programs" },
  "personality-quiz-project": { chapter: 52, section: "Mini programs" },
  "multi-file-cli-project": { chapter: 35, section: "Multi-file CLI" },
};

// Fix typo pdb key
delete SLUG_MAP.pdb;

const CHAPTER_TITLES = {
  1: "What Is Python?",
  2: "Running Python Code",
  4: "Comments",
  5: "Errors Are Normal",
  6: "Variables",
  7: "input()",
  8: "Type Conversion",
  9: "Data Types",
  10: "Numbers",
  11: "Operators",
  12: "Strings",
  13: "Booleans",
  14: "Conditions",
  15: "Lists",
  16: "Loops",
  17: "Loop Patterns",
  18: "Tuples",
  19: "Sets",
  20: "Dictionaries",
  21: "Comprehensions",
  22: "Functions",
  23: "Scope",
  24: "Advanced Function Concepts",
  25: "Errors and Exceptions",
  26: "Files",
  27: "Pathlib",
  28: "Modules",
  29: "Built-in Functions",
  30: "Standard Library Essentials",
  31: "JSON",
  32: "CSV",
  33: "Regex",
  34: "Date and Time",
  35: "Packages, Pip, and Virtual Environments",
  36: "Classes and Objects",
  37: "Class Design",
  38: "Inheritance",
  39: "Dunder Methods",
  40: "Dataclasses",
  41: "Type Hints",
  42: "Iterators",
  43: "Generators",
  44: "Decorators",
  45: "Context Managers",
  46: "Functional Tools",
  47: "collections Module",
  48: "itertools",
  49: "functools",
  50: "Debugging",
  51: "Testing",
  52: "Clean Python Style",
  53: "Performance Basics",
  54: "Memory and Object Model",
  55: "Python Execution Model",
  56: "Advanced OOP",
  57: "Concurrency Basics",
  58: "Async Python",
  59: "Advanced Packaging Preview",
};

const PART_BY_CHAPTER = [
  [1, 5, 1],
  [6, 8, 2],
  [9, 12, 3],
  [13, 14, 4],
  [15, 21, 5],
  [22, 25, 6],
  [26, 35, 7],
  [36, 40, 8],
  [41, 49, 9],
  [50, 54, 10],
  [55, 59, 11],
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
  1: ["what-is-python"],
  2: ["top-to-bottom", "first-print", "escape-characters"],
  4: ["comments"],
  5: ["syntax-errors"],
  6: [
    "creating-variables",
    "naming-rules",
    "updating-values",
    "variables-in-print",
    "multiple-assignment",
  ],
  7: ["input-basics"],
  8: ["input-conversion"],
  9: [
    "data-types-overview",
    "type-function",
    "isinstance-basics",
    "none-type",
    "mutable-immutable",
  ],
  10: ["integers-floats", "math-random-module"],
  11: [
    "arithmetic-operators",
    "assignment-operators",
    "operator-precedence",
    "tip-calculator-project",
  ],
  12: [
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
  13: [
    "booleans",
    "truthy-falsy",
    "comparisons",
    "not-operator",
    "and-or",
    "membership-identity",
  ],
  14: [
    "if-indentation",
    "elif-else",
    "nested-if",
    "login-checker-project",
    "grade-checker-project",
  ],
  15: [
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
  16: [
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
  17: ["loop-patterns"],
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
const EXTRA_SLUGS = ["escape-characters"];
const allSlugs = [...new Set([...current.lessons.map((l) => l.slug), ...EXTRA_SLUGS])].filter(
  (slug) => SLUG_MAP[slug],
);
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

writeFileSync(join(root, "docs/curriculum-order.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${lessons.length} lessons to docs/curriculum-order.json (v${out.version})`);
