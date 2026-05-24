---
name: pyguide
description: >-
  Develop the PyGuide static Python tutorial (W3Schools-style layout, one lesson per
  MDX page, left sidebar nav, Run code / Skulpt). Use for ~/Desktop/pyguide or
  pyguid repo work.
---

# PyGuide project skill

## Layout (W3Schools-style)

- Top nav: Learn | Reference | Get started (Learn/Reference visible on mobile)
- **Fixed left sidebar**: section headers + one link per lesson (click to expand)
- Main content: single topic per page, **Back / Next** buttons (labels only)
- Routes: `/` (marketing home), `/python/`, `/python/{lesson-id}/`, `/python/reference/`

## Content

- Collection: `lessons` in `src/content/lessons/*.mdx`
- One file per topic (not multi-section chapters)
- Frontmatter: `title`, `description`, `order`, `chapter`, `chapterTitle`, `level`

## Product rules

- No time estimates (minutes, hours, reading time).
- Fake IDE: read-only code, Copy, **Run code** (Skulpt).
- Optional Google sign-in stub only.

## Key files

| File | Purpose |
|------|---------|
| `src/layouts/TutorialLayout.astro` | Shell + sidebar |
| `src/components/LearnSidebar.astro` | Learn nav |
| `src/components/ReferenceSidebar.astro` | Reference nav |
| `src/pages/python/[slug].astro` | Lesson page |
| `src/components/PythonExample.astro` | Runnable example |
| `src/scripts/python-examples.ts` | Copy/Run delegation |

## Commands

```bash
npm run dev
npm run build
```
