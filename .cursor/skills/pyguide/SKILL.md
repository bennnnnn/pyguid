---
name: pyguide
description: >-
  Develop the PyGuide static Python tutorial site (Astro, MDX chapters, sub-topics,
  PythonExample Run/Copy widgets, Skulpt). Use when working in ~/Desktop/pyguide or when
  the user mentions PyGuide, Python tutorial site, chapter MDX, or PythonExample.
---

# PyGuide project skill

## Product rules

1. **Static first** — pre-rendered HTML; Run executes in-browser (Skulpt), not a server IDE.
2. **Sub-topics required** — each chapter `frontmatter.subtopics` must match `<h2 id="…">` in MDX; show in sidebar and chapter cards.
3. **No time copy** — never add minutes, hours, reading time, or completion duration.
4. **Sign-in optional** — Google only, for progress later; all lessons public without login.
5. **Fake IDE** — read-only code display; Copy + Run only (see `PythonExample.astro`).

## Adding content

1. New file: `src/content/chapters/NN-slug.mdx`
2. Frontmatter: `title`, `description`, `order`, `level`, `subtopics[]`
3. Body: `<h2 id="{subtopic.id}">` per sub-topic + prose + `<PythonExample />`
4. See `docs/content-authoring.md`

## Adding UI

- Reuse `BaseLayout`, `SiteHeader`, `ChapterSidebar`, `SubtopicNav`, `ChapterCard`
- Brand colors: `brand-*`, `ink-*` in `global.css`
- Fonts: DM Sans, JetBrains Mono (loaded in layout)

## Commands

```bash
npm run dev    # localhost:4321
npm run build  # verify before PR
```

## Do not

- Add full editable IDE (CodeMirror/Monaco) unless explicitly requested
- Add lesson duration or “X hours” stats
- Break sidebar rule: every chapter shows all its sub-topics visible (no collapse-only)
