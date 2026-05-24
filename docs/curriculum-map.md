# PyGuide curriculum map

**Source of truth:** [`curriculum-order.json`](./curriculum-order.json) · **Apply:** `npm run sync:curriculum`

## Current scale

**130 lessons** · **16 chapters** · teaching flow + TryIt on every page

## Chapter summary

| Ch | Title           | Lessons | Projects / notes                                      |
| -- | --------------- | ------- | ----------------------------------------------------- |
| 1  | Getting Started | 6       | About Me                                              |
| 2  | Variables       | 7       | Profile generator                                     |
| 3  | Data Types      | 22      | isinstance, mutable/immutable, string count           |
| 4  | Operators       | 8       | Tip calculator                                        |
| 5  | If Statements   | 4       | Login checker                                         |
| 6  | Loops           | 9       | Guessing game; loop else; infinite loops              |
| 7  | Lists           | 17      | del; todo on list-loops                               |
| 8  | Tuples          | 4       |                                                       |
| 9  | Sets            | 4       |                                                       |
| 10 | Dictionaries    | 12      | keys, nested, comprehensions, popitem                 |
| 11 | Functions       | 10      | *args/**kwargs, builtins hub                          |
| 12 | Modules         | 4       | venv, __main__                                        |
| 13 | Error Handling  | 6       | tracebacks; else/finally/raise; safe calculator       |
| 14 | Classes         | 6       | init/self, str/repr, super                            |
| 15 | Files           | 6       | modes, readlines/encoding, pathlib, notes app         |
| 16 | More Python     | 8       | math/random, debugging, quiz, dataclasses             |

## Wave 3 completed

- [x] `*args` / `**kwargs`
- [x] `__str__` / `__repr__`
- [x] `super()`
- [x] Dict key rules, `popitem`, nested, comprehensions
- [x] `del` on lists
- [x] `string.count()`
- [x] readlines + encoding
- [x] `isinstance()` + mutable vs immutable
- [x] Loop `else`, infinite loops
- [x] math/random, help/dir debugging
- [x] dataclasses preview
- [x] Login checker, safe calculator, quiz app projects

## Remaining backlog (wave 4+)

- [ ] Keyword-only parameters (dedicated lesson)
- [ ] `__init__` depth already split — expand classes-intro cross-links
- [ ] Full todo-list project page (lists chapter)
- [ ] JSON todo capstone tying files + JSON
- [ ] `random` guessing game with real `randint` (local)
- [ ] Set comprehensions
- [ ] `collections` module preview (deque, Counter)
- [ ] Testing intro (`assert`, pytest teaser)
- [ ] Async / HTTP — out of beginner scope unless requested

## Projects track

| Project          | Chapter | Status |
| ---------------- | ------- | ------ |
| About Me         | 1       | done   |
| Tip calculator   | 4       | done   |
| Login checker    | 5       | done   |
| Guessing game    | 6       | done   |
| Todo list        | 7       | partial (list-loops) |
| Contact book     | 10      | partial (dict-pop-update) |
| Safe calculator  | 13      | done   |
| Notes app        | 15      | done   |
| Quiz app         | 16      | done   |

## Reordering

1. Edit `curriculum-order.json`
2. Add/remove `src/content/lessons/<slug>.mdx`
3. `npm run sync:curriculum`
4. Redirects in `astro.config.mjs` if slug changes
5. `npm run build`
