# PyGuide curriculum map

**Source of truth:** [`curriculum-order.json`](./curriculum-order.json) · **Apply:** `npm run sync:curriculum`

## Current scale

**180 lessons** · **16 chapters** · teaching flow + TryIt on every page

## Chapter summary

| Ch | Title           | Lessons | Projects / notes                                      |
| -- | --------------- | ------- | ----------------------------------------------------- |
| 1  | Getting Started | 6       | About Me                                              |
| 2  | Variables       | 7       | Profile generator                                     |
| 3  | Data Types      | 22      | isinstance, mutable/immutable                         |
| 4  | Operators       | 8       | Tip calculator                                        |
| 5  | If Statements   | 4       | Login checker                                         |
| 6  | Loops           | 10      | Guessing + random                                     |
| 7  | Lists           | 20      | Todo list project                                     |
| 8  | Tuples          | 5       | namedtuple                                            |
| 9  | Sets            | 6       | comprehensions, frozenset                             |
| 10 | Dictionaries    | 14      | Contact book                                          |
| 11 | Functions       | 15      | TypedDict, Protocol, mypy                             |
| 12 | Modules         | 11      | env, secrets, subprocess, pyproject                   |
| 13 | Error Handling  | 7       | Safe calculator                                       |
| 14 | Classes         | 9       | property, static/classmethod                          |
| 15 | Files           | 13      | CSV, paths, INI config                                |
| 16 | More Python     | 25      | sqlite, HTTP, capstones, unittest, functools          |

## Wave 6 completed

- [x] TypedDict and Protocol
- [x] mypy static checking
- [x] os.environ and secrets
- [x] subprocess.run + shell safety
- [x] pyproject.toml packaging
- [x] CSV, relative/absolute paths, configparser INI
- [x] sqlite3 basics
- [x] HTTP (urllib + requests teaser)
- [x] unittest module
- [x] functools.lru_cache, copy.deepcopy
- [x] Database todo + multi-file CLI capstones

## Remaining backlog (wave 7+)

- [ ] Async / aiohttp — only if requested
- [ ] PyPI publish walkthrough (hands-on)
- [ ] SQLAlchemy ORM teaser
- [ ] Git for Python devs (branch, commit, PR)
- [ ] Performance profiling (`cProfile`)
- [ ] Web framework teaser (Flask/FastAPI one-pager)

## Projects track

| Project              | Chapter | Status |
| -------------------- | ------- | ------ |
| About Me             | 1       | done   |
| Tip calculator       | 4       | done   |
| Login checker        | 5       | done   |
| Guessing games       | 6       | done   |
| Todo list            | 7       | done   |
| Contact book         | 10      | done   |
| Safe calculator      | 13      | done   |
| Notes app            | 15      | done   |
| Quiz / personality   | 16      | done   |
| JSON todo            | 16      | done   |
| Database todo        | 16      | done   |
| Multi-file CLI       | 16      | done   |

## Reordering

1. Edit `curriculum-order.json`
2. Add/remove `src/content/lessons/<slug>.mdx`
3. `npm run sync:curriculum`
4. Redirects in `astro.config.mjs` if slug changes
5. `npm run build`
