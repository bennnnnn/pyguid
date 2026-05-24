# PyGuide

Free Python tutorial for **absolute beginners** — short lessons, **Run code** in the browser (Skulpt), W3Schools-style sidebar, no install required.

**Live site:** [bennnnnn.github.io/pyguid](https://bennnnnn.github.io/pyguid)  
**Repository:** [github.com/bennnnnn/pyguid](https://github.com/bennnnnn/pyguid)

## Features

- 74+ step-by-step lessons (Getting Started → data types → logic → collections → functions → files)
- Runnable examples on every lesson page (Copy + Run)
- Chapter learning paths on [/python/](https://bennnnnn.github.io/pyguid/python/)
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

| Command                | Action                   |
| ---------------------- | ------------------------ |
| `npm run dev`          | Dev server               |
| `npm run build`        | Static site → `dist/`    |
| `npm run preview`      | Preview production build |
| `npm run format`       | Format with Prettier     |
| `npm run check:format` | Check formatting (CI)    |

## Stack

- [Astro](https://astro.build/) 6 + MDX content collections
- Tailwind CSS v4
- [Skulpt](https://skulpt.org/) for in-browser Python

## Project layout

```
src/
  content/lessons/     # One MDX file per lesson
  components/          # PythonExample, Callout, TryIt, sidebar, …
  pages/python/        # Course + reference routes
  lib/lessons.ts       # Grouping, sidebar order, lesson counts
  scripts/             # Skulpt runner + example buttons
docs/content-authoring.md
```

## Deploy

```bash
npm run build
```

Set `SITE_URL` when building for production (canonical URLs + sitemap):

```bash
SITE_URL=https://your-domain.com npm run build
```

Default site URL: `https://bennnnnn.github.io/pyguid` (see `astro.config.mjs`).

## License

MIT — see [LICENSE](LICENSE).

## Topics

`python` `tutorial` `beginners` `education` `astro` `mdx` `skulpt` `learn-python`
