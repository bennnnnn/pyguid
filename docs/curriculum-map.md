# PyGuide curriculum map

**Source of truth:** [`curriculum-order.json`](./curriculum-order.json) · **Generate v11:** `node scripts/generate-curriculum-v11.mjs` · **Apply:** `npm run sync:curriculum`

## Current scale

**187 lessons** · **31 chapters** (30 Python topics + Python Mini Programs) · pure Python course

## Chapter summary (v11)

| Ch  | Title                       | Lessons | Notes                        |
| --- | --------------------------- | ------- | ---------------------------- |
| 1   | What is Python?             | 1       |                              |
| 2   | Print, Comments, and Errors | 5       | About Me mini program        |
| 3   | Variables                   | 4       |                              |
| 4   | Input and Type Conversion   | 3       |                              |
| 5   | Data Types                  | 5       |                              |
| 6   | Numbers and Operators       | 5       | Tip calculator               |
| 7   | Strings                     | 13      | Name formatter, word counter |
| 8   | Booleans and Conditions     | 11      | Login checker, grade checker |
| 9   | Loops                       | 10      | Guessing games               |
| 10  | Lists                       | 20      | Todo list, shopping list     |
| 11  | Tuples                      | 5       |                              |
| 12  | Sets                        | 5       |                              |
| 13  | Dictionaries                | 13      | Contact book                 |
| 14  | Functions                   | 6       |                              |
| 15  | Scope                       | 1       |                              |
| 16  | Error Handling              | 8       | Safe calculator              |
| 17  | Files                       | 13      | Notes app                    |
| 18  | Modules                     | 8       |                              |
| 19  | Packages and Imports        | 2       | venv, requirements           |
| 20  | Useful Built-in Functions   | 1       |                              |
| 21  | Comprehensions              | 4       |                              |
| 22  | Object-Oriented Python      | 10      | Dunder methods               |
| 23  | Advanced Functions          | 5       |                              |
| 24  | Iterators and Generators    | 3       | iter() / iterator protocol   |
| 25  | Decorators                  | 1       |                              |
| 26  | Type Hints                  | 4       | mypy                         |
| 27  | Python Standard Library     | 11      | json, logging, regex, etc.   |
| 28  | Debugging Python Code       | 4       |                              |
| 29  | Testing Python Code         | 3       |                              |
| 30  | Writing Clean Python        | 1       | ruff/black                   |
| 31  | Python Mini Programs        | 3       | Quiz apps, multi-file CLI    |

## Quizzes

Chapter quizzes: `/python/quiz/{topic-slug}/` — see `src/lib/quiz-topics.ts`.

Chapter 4 (Input) quiz: published (`chapter-4.json`).

## Archived (not in course)

See `src/archive/lessons/README.md` — web frameworks, databases, Git/CI/PyPI, async I/O track.

## Maintainer workflow

1. Edit `docs/curriculum-order.json` or regenerate with `generate-curriculum-v11.mjs`
2. `npm run sync:curriculum`
3. Update `quiz-topics.ts` if chapter count/titles change
4. Add or remap `src/data/quizzes/chapter-N.json` for new chapters
