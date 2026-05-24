# PyGuide curriculum map

**Source of truth:** [`curriculum-order.json`](./curriculum-order.json) · **Apply:** `npm run sync:curriculum`

## Current scale

**164 lessons** · **16 chapters** · teaching flow + TryIt on every page

## Chapter summary

| Ch | Title           | Lessons | Projects / notes                                      |
| -- | --------------- | ------- | ----------------------------------------------------- |
| 1  | Getting Started | 6       | About Me                                              |
| 2  | Variables       | 7       | Profile generator                                     |
| 3  | Data Types      | 22      | isinstance, mutable/immutable, string count           |
| 4  | Operators       | 8       | Tip calculator                                        |
| 5  | If Statements   | 4       | Login checker                                         |
| 6  | Loops           | 10      | Guessing game + random randint                        |
| 7  | Lists           | 20      | zip, todo, nested comprehensions                      |
| 8  | Tuples          | 5       | namedtuple preview                                    |
| 9  | Sets            | 6       | set comprehensions, frozenset                         |
| 10 | Dictionaries    | 14      | setdefault, contact book                              |
| 11 | Functions       | 13      | type hints depth                                      |
| 12 | Modules         | 7       | sys.argv, argparse                                    |
| 13 | Error Handling  | 7       | multiple except types                                 |
| 14 | Classes         | 9       | property, static/classmethod                          |
| 15 | Files           | 10      | context managers, glob, shutil                        |
| 16 | More Python     | 18      | pytest, enum, itertools, generators, personality quiz |

## Wave 5 completed

- [x] Type hints depth (`list[str]`, `str | None`)
- [x] `sys.argv` and **argparse**
- [x] Custom **context managers** (`contextlib`)
- [x] **enum**, **itertools**, **generators**
- [x] **pytest** lesson
- [x] **logging** basics
- [x] **match/case** preview
- [x] **Decorators** preview
- [x] `@property`, staticmethod, classmethod
- [x] pathlib **glob**, **shutil** copy/move
- [x] **Personality quiz** capstone

## Remaining backlog (wave 6+)

- [ ] Async / HTTP — out of scope unless requested
- [ ] Full mypy / typing (`Protocol`, `TypedDict`)
- [ ] `subprocess` and shell safety
- [ ] `sqlite3` mini database lesson
- [ ] `requests` / HTTP (external dep)
- [ ] Packaging (`pyproject.toml`, publish teaser)
- [ ] Capstone: multi-file CLI app combining argparse + JSON + tests

## Projects track

| Project            | Chapter | Status |
| ------------------ | ------- | ------ |
| About Me           | 1       | done   |
| Tip calculator       | 4       | done   |
| Login checker        | 5       | done   |
| Guessing game        | 6       | done   |
| Random guessing      | 6       | done   |
| Todo list            | 7       | done   |
| Contact book         | 10      | done   |
| Safe calculator      | 13      | done   |
| Notes app            | 15      | done   |
| Quiz app             | 16      | done   |
| JSON todo            | 16      | done   |
| Personality quiz     | 16      | done   |

## Reordering

1. Edit `curriculum-order.json`
2. Add/remove `src/content/lessons/<slug>.mdx`
3. `npm run sync:curriculum`
4. Redirects in `astro.config.mjs` if slug changes
5. `npm run build`
