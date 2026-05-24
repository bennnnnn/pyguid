# PyGuide curriculum map

**Source of truth for lesson order:** [`curriculum-order.json`](./curriculum-order.json)  
**Apply order to MDX files:** `node scripts/sync-curriculum.mjs`

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

## Current chapters (17)

| Ch  | Title           | Lessons | Mini project / notes                         |
| --- | --------------- | ------- | -------------------------------------------- |
| 1   | Getting Started | 6       | About Me                                     |
| 2   | Variables       | 7       | Profile generator (input-conversion)         |
| 3   | Data Types      | 18      | Profile card on type(); Strings section      |
| 4   | Operators       | 7       | Was split from Comparisons + Logical         |
| 5   | If Statements   | 3       | Login checker patterns in nested-if          |
| 6   | Loops           | 6       | Guessing game patterns in break-continue     |
| 7   | Lists           | 16      | Todo list on list-loops; comprehensions here |
| 8   | Tuples          | 2       | Needs expansion (immutability, one-tuple)    |
| 9   | Sets            | 2       | Needs add/remove/discard lessons             |
| 10  | Dictionaries    | 8       | Contact book on dict-pop-update              |
| 11  | Functions       | 4       | Calculator on function-scope                 |
| 12  | Modules         | 2       | Needs venv, `__main__`, own modules          |
| 13  | Error Handling  | 2       | Safe calculator on common-exceptions         |
| 14  | Classes         | 3       | Pet shelter on inheritance                   |
| 15  | Files           | 2       | Needs pathlib, modes, `with open` depth      |
| 16  | More Python     | 4       | JSON, datetime, regex, lambda                |

**Total lessons:** 88 (after curriculum expansion pass)

## Gap backlog (not yet separate lessons)

Prioritized from curriculum review. Add as MDX + row in `curriculum-order.json`.

### High priority

- [ ] Built-in functions hub (`len`, `sum`, `sorted`, `zip`, `any`, `all`)
- [ ] Debugging / reading tracebacks (expand syntax-errors + exceptions)
- [ ] `print` vs `return` (functions)
- [ ] Default parameters + keyword arguments (functions)
- [ ] Docstrings + basic type hints (functions)
- [ ] `try` / `else` / `finally` / `raise` (exceptions)
- [ ] File paths, modes (`r`/`w`/`a`), encoding, `with open`
- [ ] `pathlib` intro
- [ ] `__init__`, `self`, `__str__` (classes — may be inside intro but deserve clarity)
- [ ] Set methods: `add`, `remove`, `discard`, empty set `set()`
- [ ] Tuple immutability, one-item tuple
- [ ] Dict: key rules, `popitem`, comprehensions, nested dict lesson
- [ ] List: `del` on index/slice (partially in dict-pop-update)
- [ ] String `count()` dedicated page (optional — partly in find/replace)

### Medium priority

- [ ] `isinstance()`
- [ ] Mutable vs immutable overview
- [ ] Loop `else` clause
- [ ] Infinite loops (while True + break)
- [ ] `venv`, `requirements.txt`, `__name__ == "__main__"`
- [ ] `dataclasses` preview
- [ ] Dict/set comprehensions
- [ ] `random` / `math` module mini chapter
- [ ] Type hints chapter (modern Python)

### Projects track (future)

Standalone project pages or capstones every ~4 chapters:

- About Me (ch 1) — done
- Tip calculator (operators + input)
- Number guessing game (loops)
- Todo list CLI (lists)
- Contact book (dicts) — partial on dict-pop-update
- Quiz app (functions + dicts)
- Notes app (files + JSON)

## Chapter audit grades (review baseline)

| Area              | Grade | Status after expansion pass         |
| ----------------- | ----- | ----------------------------------- |
| Getting Started   | 6.5→8 | + syntax errors, About Me           |
| Variables         | 7→8   | + input, conversion, multi-assign   |
| Data Types        | 5.5→7 | + overview, truthy, None earlier    |
| Operators         | 3.5→7 | New chapter with 7 lessons          |
| Strings (in ch 3) | 8     | endswith, immutability in lessons   |
| If / Loops        | 6.5→7 | + nested if, patterns, nested loops |
| Lists             | 8→8.5 | + slicing, enumerate, comp moved    |
| Tuples / Sets     | 5     | Still thin — backlog                |
| Dicts             | 7     | Renamed dict-loops slug             |
| Functions         | 7     | Backlog: print/return, hints        |
| Files             | 4.5   | Backlog: pathlib, modes             |
| Exceptions        | 5     | Backlog: finally, raise             |
| Modules           | 4     | Backlog: venv, own modules          |
| OOP               | 4.5   | Backlog: self, **init** breakout    |

## Reordering policy

1. Edit `docs/curriculum-order.json` (insert slug or move entry).
2. Add/remove `src/content/lessons/<slug>.mdx`.
3. Run `node scripts/sync-curriculum.mjs`.
4. Add Astro `redirects` in `astro.config.mjs` if a public slug renames.
5. `npm run build` to verify.

## Conventions

- One MDX file = one topic = one sidebar link (W3Schools style).
- `order` is global for prev/next; `chapter` groups the sidebar.
- `section` nests under a chapter (e.g. Strings inside Data Types).
- No reading-time estimates in content.
