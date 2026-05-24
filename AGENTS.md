# PyGuide — agent instructions

Static Astro site at `~/Desktop/pyguide`.

## Stack

- Astro 6 + MDX content collections + Tailwind v4
- Lessons in `src/content/lessons/*.mdx` (one topic per page)
- `PythonExample` component: read-only fake IDE, Copy, Run (Skulpt CDN)

## Conventions

- **No time estimates** — never add minutes, hours, or “reading time”.
- **W3Schools layout** — `TutorialLayout` with left sidebar listing every lesson under section headers.
- **One page per topic** — not multi-section chapter pages.
- **Auth** — optional Google only; not required to read content.
- **Scope** — minimize diffs; match existing component patterns.

## Key files

| File                                 | Purpose                  |
| ------------------------------------ | ------------------------ |
| `src/content.config.ts`              | Lesson collection schema |
| `src/pages/python/[slug].astro`      | Lesson page              |
| `src/components/PythonExample.astro` | Runnable snippet UI      |
| `src/scripts/run-python.ts`          | Skulpt runner            |

## Skill

Use project skill: `.cursor/skills/pyguide/SKILL.md`
