# pyguid (PyGuide)

Free, static Python tutorial site. Chapters list sub-topics upfront; every example has **Copy** and **Run** (browser Python via Skulpt).

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
  content/chapters/   # Chapter MDX (frontmatter + sub-topics + lessons)
  components/         # UI (PythonExample, sidebar, header, …)
  pages/              # Routes (home, learn, cheatsheet, about)
  lib/                # Site config, chapter helpers
docs/
  content-authoring.md
.cursor/skills/pyguide/
```

## Add a chapter

1. Create `src/content/chapters/05-loops.mdx`
2. Set `order`, `title`, `description`, `subtopics[]` in frontmatter
3. Use `<h2 id="slug">Title</h2>` matching each sub-topic `id`
4. Add `<PythonExample filename="…" code={\`…\`} />` blocks

See [docs/content-authoring.md](docs/content-authoring.md).

## Auth (planned)

Optional Google sign-in for progress only. Stub modal in place; wire Supabase Auth or Auth.js when ready.

## Deploy

Build `dist/` and host on Vercel, Cloudflare Pages, or Netlify. Set `site` in `astro.config.mjs` to your real domain.
