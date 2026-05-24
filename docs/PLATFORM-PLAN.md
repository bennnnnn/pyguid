# PyGuide platform plan (L4 + SEO)

**Positioning:** Learn Python from zero to job-ready — runnable examples, projects, quizzes (planned), and real developer skills.

**Current scale (2026):** 197 lessons · 16 chapters · professional track (testing, typing, Git, FastAPI, SQLite, CI).

## Review score context

External review (~5.8/10) assumed a small beginner-only site. Much of **Track B** (debugging, pytest, typing, logging, Git, venv, argparse) and many **projects** now exist. Gaps are mainly **depth per page**, **SEO landing architecture**, **assessments**, and **L5–L6** (auth, deploy, interviews).

## Two learning modes (target)

| Mode               | User                 | Experience                                |
| ------------------ | -------------------- | ----------------------------------------- |
| **Course path**    | “Teach me Python”    | Chapters 1→16, projects                   |
| **Search landing** | “python list append” | One focused page → related links → course |

Implemented: related-lesson block, comparison lesson `list-append-vs-extend`. Next: FAQ schema per lesson, more comparison pages.

## Level map (zero → L4)

Documented in `docs/curriculum-map.md` and chapter order in the course sidebar.

| Level | Focus                                | Status                  |
| ----- | ------------------------------------ | ----------------------- |
| L0    | print, variables, input              | Strong                  |
| L1    | types, operators, collections        | Strong                  |
| L2    | functions, debugging, patterns       | Good — deepen exercises |
| L3    | files, JSON, modules, venv           | Strong                  |
| L4    | typing, pytest, Git, lint, packaging | Good                    |
| L5    | HTTP, Flask, FastAPI, DB, async      | Teaser + capstones      |
| L6    | interviews, perf, production         | Partial — build next    |

## SEO checklist

### Done (wave: platform)

- [x] Canonical URL matches GitHub Pages (`astro.config.mjs` + `SITE.url`)
- [x] `robots.txt` + sitemap URL fixed
- [x] Open Graph + Twitter meta (`SeoHead.astro`)
- [x] JSON-LD: `LearningResource` + `BreadcrumbList` on lessons
- [x] Skulpt loads on **Run** only (not on page load)
- [x] Internal links: related lessons per chapter
- [x] **Track A batch 1 (30):** `quickAnswer`, `faqs`, FAQPage schema, “Why this matters”
- [x] **Track A batch 2 (30):** same treatment — see `docs/seo-top-30-batch2-meta.json`
- [x] **Practice hub** `/python/practice/` (exams separate from lessons)

### Next

- [ ] Google Search Console + submit sitemap
- [ ] Dedicated OG image (1200×630)
- [ ] Track A batch 3 (30) + more “vs” comparison pages (`list-vs-tuple`, etc.)
- [ ] **Practice exams** content per chapter (on practice hub only)
- [ ] Interview question hub

## Lesson template (target)

1. Plain-English explanation
2. Why it matters
3. Tiny example + Run
4. Line-by-line
5. TryIt + change-it exercise
6. Common mistake (`Callout`)
7. Real-world use
8. FAQ (SEO)
9. Related lessons
10. Recap + next

Roll out by rewriting highest-traffic pages first (`list-append`, `for-loops`, `functions-intro` started).

## Product features (prioritized)

| Priority | Feature                                 |
| -------- | --------------------------------------- |
| P0       | Lesson depth + FAQ                      |
| P0       | SEO metadata + schema                   |
| P1       | Quizzes per chapter                     |
| P1       | Progress (localStorage → optional auth) |
| P2       | Search box                              |
| P2       | Cheat sheets PDF                        |
| P3       | XP / streaks                            |

## GitHub repo metadata (manual)

Set on github.com/bennnnnn/pyguid:

- **Description:** Free Python course — 197 lessons, runnable examples, zero to job-ready Python
- **Website:** https://bennnnnn.github.io/pyguid
- **Topics:** `python`, `tutorial`, `learn-python`, `education`, `astro`, `mdx`, `pytest`, `fastapi`
