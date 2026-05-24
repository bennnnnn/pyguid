# PyGuide curriculum map

**Source of truth for lesson order:** [`curriculum-order.json`](./curriculum-order.json)  
**Apply order to MDX files:** `npm run sync:curriculum`

## Target lesson shape (every page)

1. What is this? (analogy / story)
2. One new idea
3. Syntax + runnable examples
4. Line-by-line or before/after table
5. Real use case
6. Common mistakes (`Callout`)
7. `<TryIt>` exercise
8. Recap + next lesson link

Chapter intros and final lessons add a **mini project** where noted below.

## Current chapters (16)

| Ch  | Title           | Lessons | Mini projects / notes                              |
| --- | --------------- | ------- | -------------------------------------------------- |
| 1   | Getting Started | 6       | About Me                                           |
| 2   | Variables       | 7       | Profile generator (input-conversion)               |
| 3   | Data Types      | 18      | Strings section; None early                        |
| 4   | Operators       | 8       | **Tip calculator**                                 |
| 5   | If Statements   | 3       | Nested if                                          |
| 6   | Loops           | 7       | **Guessing game**                                  |
| 7   | Lists           | 16      | Todo on list-loops; comprehensions in chapter      |
| 8   | Tuples          | 4       | Immutability + one-item tuple                      |
| 9   | Sets            | 4       | add/remove/discard + empty set                     |
| 10  | Dictionaries    | 8       | Contact book on dict-pop-update                      |
| 11  | Functions       | 9       | Defaults, print/return, docstrings, hints, builtins |
| 12  | Modules         | 4       | venv, `__main__` guard                               |
| 13  | Error Handling  | 5       | Tracebacks, else/finally, raise                      |
| 14  | Classes         | 4       | **`__init__` / `self`**; pet shelter on inheritance |
| 15  | Files           | 5       | Modes, pathlib, **Notes app**                        |
| 16  | More Python     | 4       | lambda, JSON, datetime, regex                        |

**Total lessons:** 110

## Completed from backlog (wave 2)

- [x] Built-in functions hub
- [x] Reading tracebacks
- [x] `print` vs `return`
- [x] Default parameters
- [x] Docstrings + type hints intro
- [x] `try` / `else` / `finally` / `raise`
- [x] File paths and modes (`r`/`w`/`a`)
- [x] `pathlib` intro
- [x] `__init__` and `self`
- [x] Set `add` / `remove` / `discard` + empty `set()`
- [x] Tuple immutability + one-item tuple
- [x] Tip calculator + guessing game projects
- [x] venv + requirements.txt
- [x] `if __name__ == "__main__"`

## Gap backlog (still open)

### High priority

- [ ] Keyword-only / `*args` / `**kwargs` (functions)
- [ ] `__str__` / `__repr__` (classes)
- [ ] `super()` deep dive (inheritance)
- [ ] Dict: key rules, `popitem`, nested dicts, dict comprehensions
- [ ] List: dedicated `del` lesson
- [ ] String `count()` page
- [ ] File encoding, `readline` / `readlines` depth
- [ ] `isinstance()` and mutable vs immutable overview

### Medium priority

- [ ] Loop `else` clause
- [ ] Infinite loops lesson
- [ ] `dataclasses` preview
- [ ] `random` / `math` mini chapter
- [ ] Debugging tools (`help`, `dir`) lesson
- [ ] Login checker project (if statements)
- [ ] Quiz app / JSON todo capstone

### Projects track

| Project        | Chapter | Status   |
| -------------- | ------- | -------- |
| About Me       | 1       | done     |
| Tip calculator | 4       | done     |
| Guessing game  | 6       | done     |
| Todo list      | 7       | partial (list-loops) |
| Contact book   | 10      | partial (dict-pop-update) |
| Notes app      | 15      | done     |
| Safe calculator| 13      | partial (common-exceptions) |

## Reordering policy

1. Edit `docs/curriculum-order.json`.
2. Add/remove `src/content/lessons/<slug>.mdx`.
3. Run `npm run sync:curriculum`.
4. Add Astro `redirects` if a slug renames.
5. `npm run build`.
