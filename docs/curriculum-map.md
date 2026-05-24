# PyGuide curriculum map

**Source of truth:** [`curriculum-order.json`](./curriculum-order.json) · **Apply:** `npm run sync:curriculum`

## Current scale

**191 lessons** · **25 chapters** · core Python only (web frameworks archived separately)

## Chapter summary

| Ch  | Title           | Lessons | Projects / notes                      |
| --- | --------------- | ------- | ------------------------------------- |
| 1   | Getting Started | 6       | About Me                              |
| 2   | Variables       | 7       | Profile generator                     |
| 3   | Data Types      | 22      |                                       |
| 4   | Operators       | 8       | Tip calculator                        |
| 5   | If Statements   | 4       | Login checker                         |
| 6   | Loops           | 10      | Guessing games                        |
| 7   | Lists           | 20      | Todo list                             |
| 8   | Tuples          | 5       |                                       |
| 9   | Sets            | 6       |                                       |
| 10  | Dictionaries    | 14      | Contact book                          |
| 11  | Functions       | 15      | TypedDict, mypy                       |
| 12  | Modules         | 15      | git, PyPI, GitHub Actions, ruff/black |
| 13  | Error Handling  | 8       | Exception chaining                    |
| 14  | Classes         | 10      | Dunder methods                        |
| 15  | Files           | 13      | CSV, INI, paths                       |
| 16  | Debugging       | 4       | pdb, cProfile, timeit                 |
| 17  | Testing         | 3       | assert, pytest, unittest              |
| 18  | Functional Python | 5     | lambda, decorators, generators        |
| 19  | Standard Library | 4      | collections, enum, math, copy         |
| 20  | JSON            | 2       | json module + todo project            |
| 21  | Dataclasses & Dates | 3   | dataclass, datetime, match            |
| 22  | Logging & Regex | 2       | logging, re                           |
| 23  | Databases       | 3       | SQLite, SQLAlchemy preview            |
| 24  | Async Python    | 1       | async/await (stdlib asyncio)          |
| 25  | Projects        | 3       | quiz apps, multi-file CLI capstone    |

## Wave 7 completed

- [x] Git workflow (commit, branch, PR)
- [x] PyPI publish walkthrough
- [x] GitHub Actions CI
- [x] ruff / black code quality
- [x] Exception chaining
- [x] Dunder methods
- [x] pdb, cProfile, timeit
- [x] SQLAlchemy ORM preview
- [x] async/await + aiohttp
- [x] Flask + FastAPI teasers
- [x] Flask JSON API capstone
- [x] Jupyter notebooks preview

## Remaining backlog (wave 8+)

- [ ] Alembic database migrations
- [ ] Docker for Python apps
- [ ] Deploy Flask/FastAPI (Render/Fly teaser)
- [ ] Property-based testing (Hypothesis)
- [ ] Advanced typing (Generics, TypeVar)
- [ ] Contributing to open source guide

## Projects track

| Project           | Chapter | Status |
| ----------------- | ------- | ------ |
| CLI capstones     | 12/16   | done   |
| Database todo     | 16      | done   |
| Flask JSON API    | 16      | done   |
| All chapter minis | 1–16    | done   |

## Reordering

1. Edit `curriculum-order.json`
2. Add/remove `src/content/lessons/<slug>.mdx`
3. `npm run sync:curriculum`
4. Redirects in `astro.config.mjs` if slug changes
5. `npm run build`
