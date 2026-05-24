# PyGuide

**Learn Python from zero to advanced core Python** — 187 tutorials, **Run code** in the browser (Skulpt), chapter quizzes, and a syntax reference.

**Live site:** [bennnnnn.github.io/pyguid](https://bennnnnn.github.io/pyguid)  
**Repository:** [github.com/bennnnnn/pyguid](https://github.com/bennnnnn/pyguid)

## Features

- **187 tutorials** — beginner syntax through OOP, comprehensions, stdlib, testing, and debugging
- **Tutorials · Quizzes · References** — three clear sections in the nav
- Runnable examples on every lesson (Copy + Run)
- Chapter sidebar + ordered lesson path (Back / Next)
- Small chapter exercises woven through the course (core Python only)
- SEO: canonical URLs, Open Graph, JSON-LD on lessons, sitemap
- Syntax reference at `/python/reference/`

## Quick start

```bash
git clone https://github.com/bennnnnn/pyguid.git
cd pyguid
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Commands

| Command                   | Action                             |
| ------------------------- | ---------------------------------- |
| `npm run dev`             | Dev server                         |
| `npm run build`           | Static site → `dist/`              |
| `npm run preview`         | Preview production build           |
| `npm run format`          | Format with Prettier               |
| `npm run check:format`    | Check formatting (CI)              |
| `npm run sync:curriculum` | Apply `docs/curriculum-order.json` |

## Stack

- [Astro](https://astro.build/) 6 + MDX content collections
- Tailwind CSS v4
- [Skulpt](https://skulpt.org/) (loaded on first **Run**, not every page)

## Project layout

```
src/
  content/lessons/     # One MDX file per lesson
  components/          # PythonExample, SeoHead, Callout, …
  pages/python/
    index.astro        # Tutorials landing
    [slug].astro       # Lesson pages
    quiz/              # Quizzes hub + [topic] pages
    reference/         # Reference hub
  data/practice-exams/ # Quiz question JSON (internal name; public URL is /python/quiz/)
  lib/lessons.ts       # Sidebar order, related lessons
docs/
  curriculum-order.json
  PLATFORM-PLAN.md     # L4 + SEO strategy
```

## Deploy

```bash
SITE_URL=https://bennnnnn.github.io/pyguid npm run build
```

Default site URL is set in `astro.config.mjs`. Override with `SITE_URL` for custom domains.

## License

MIT — see [LICENSE](LICENSE).

## Topics

`python` `tutorial` `learn-python` `beginners` `education` `astro` `mdx` `skulpt` `pytest` `fastapi` `type-hints`
