# pyguid (PyGuide)

Free, static Python tutorial site (**W3Schools-style**): left sidebar with every topic, one page per lesson, **Run code** examples (Skulpt in the browser).

Repository: [github.com/bennnnnn/pyguid](https://github.com/bennnnnn/pyguid)

## Quick start

```bash
cd ~/Desktop/pyguide
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server |
| `npm run build` | Static site → `dist/` |
| `npm run preview` | Preview production build |

## Project layout

```
src/
  content/lessons/    # One MDX file per topic (W3Schools-style pages)
  components/         # UI (PythonExample, sidebar, header, …)
  pages/              # Routes (home, learn, cheatsheet, about)
  lib/                # Site config, chapter helpers
docs/
  content-authoring.md
.cursor/skills/pyguide/
```

## Add a lesson

1. Create `src/content/lessons/my-topic.mdx`
2. Set `order`, `title`, `chapter`, `chapterTitle`, `description`
3. Add prose + `<PythonExample />` blocks

See [docs/content-authoring.md](docs/content-authoring.md).

## Auth (planned)

Optional Google sign-in for progress only. Stub modal in place; wire Supabase Auth or Auth.js when ready.

## Deploy

Build `dist/` and host on Vercel, Cloudflare Pages, or Netlify. Set `site` in `astro.config.mjs` to your real domain.
