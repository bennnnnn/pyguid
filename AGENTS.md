# PyGuide — agent instructions

Static Astro site at `~/Desktop/pyguide`.

## Stack

- Astro 6 + MDX content collections + Tailwind v4
- Chapters in `src/content/chapters/*.mdx`
- `PythonExample` component: read-only fake IDE, Copy, Run (Skulpt CDN)

## Conventions

- **No time estimates** — never add minutes, hours, or “reading time”.
- **Sub-topics** — every chapter frontmatter `subtopics` array; each maps to `<h2 id="…">` in MDX.
- **Sidebar** — always shows all chapters with full sub-topic lists (see `ChapterSidebar.astro`).
- **Auth** — optional Google only; not required to read content.
- **Scope** — minimize diffs; match existing component patterns.

## Key files

| File | Purpose |
|------|---------|
| `src/content/config.ts` | Chapter schema |
| `src/pages/learn/[slug].astro` | Chapter page |
| `src/components/PythonExample.astro` | Runnable snippet UI |
| `src/scripts/run-python.ts` | Skulpt runner |

## Skill

Use project skill: `.cursor/skills/pyguide/SKILL.md`
