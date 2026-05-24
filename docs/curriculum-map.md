# PyGuide curriculum map

**Source of truth:** [`curriculum-order.json`](./curriculum-order.json) · **Apply:** `npm run sync:curriculum`

## Current scale

**148 lessons** · **16 chapters** · teaching flow + TryIt on every page

## Chapter summary

| Ch | Title           | Lessons | Projects / notes                                      |
| -- | --------------- | ------- | ----------------------------------------------------- |
| 1  | Getting Started | 6       | About Me                                              |
| 2  | Variables       | 7       | Profile generator                                     |
| 3  | Data Types      | 22      | isinstance, mutable/immutable, string count           |
| 4  | Operators       | 8       | Tip calculator                                        |
| 5  | If Statements   | 4       | Login checker                                         |
| 6  | Loops           | 10      | Guessing game + random randint variant                |
| 7  | Lists           | 20      | zip, todo project, nested comprehensions              |
| 8  | Tuples          | 5       | namedtuple preview                                    |
| 9  | Sets            | 6       | set comprehensions, frozenset                         |
| 10 | Dictionaries    | 14      | setdefault, contact book project                      |
| 11 | Functions       | 12      | keyword-only, unpacking calls                         |
| 12 | Modules         | 5       | from/import/as                                        |
| 13 | Error Handling  | 7       | multiple except types                                 |
| 14 | Classes         | 7       | instance vs class attributes                          |
| 15 | Files           | 7       | append mode                                           |
| 16 | More Python     | 11      | collections, assert, JSON todo capstone               |

## Wave 4 completed

- [x] Keyword-only parameters
- [x] Unpacking `*` / `**` when calling
- [x] Full todo-list project
- [x] JSON todo capstone
- [x] Random guessing game (`randint`)
- [x] Set comprehensions + frozenset
- [x] `collections` preview (Counter, deque, defaultdict)
- [x] Testing intro (`assert`, pytest teaser)
- [x] Contact book project
- [x] `dict.setdefault()`
- [x] `zip()`, nested list comprehensions
- [x] namedtuple preview
- [x] `import from as`
- [x] Multiple exception types
- [x] Instance vs class attributes
- [x] File append mode
- [x] classes-intro cross-links

## Remaining backlog (wave 5+)

- [ ] `contextlib` / `with` for custom resources (beyond files)
- [ ] `enum` module preview
- [ ] `itertools` preview (chain, islice)
- [ ] Full pytest lesson with sample test file
- [ ] CLI argparse mini-lesson
- [ ] Type hints depth (`Optional`, `list[str]`)
- [ ] Async / HTTP — out of beginner scope unless requested
- [ ] Personality / capstone UI pages from original review

## Projects track

| Project          | Chapter | Status |
| ---------------- | ------- | ------ |
| About Me         | 1       | done   |
| Tip calculator   | 4       | done   |
| Login checker    | 5       | done   |
| Guessing game    | 6       | done   |
| Random guessing  | 6       | done   |
| Todo list        | 7       | done   |
| Contact book     | 10      | done   |
| Safe calculator  | 13      | done   |
| Notes app        | 15      | done   |
| Quiz app         | 16      | done   |
| JSON todo        | 16      | done   |

## Reordering

1. Edit `curriculum-order.json`
2. Add/remove `src/content/lessons/<slug>.mdx`
3. `npm run sync:curriculum`
4. Redirects in `astro.config.mjs` if slug changes
5. `npm run build`
