# Content authoring (W3Schools-style)

## One page = one topic

Path: `src/content/lessons/your-slug.mdx`

```yaml
---
title: "Python list append() explained"
description: "SEO meta description (140–160 chars, include search phrase)"
order: 5
chapter: 7
chapterTitle: "Lists"
section: "Lists" # optional
level: beginner
quickAnswer: "One-sentence direct answer for the top of the page."
faqs:
  - question: "Does append return a new list?"
    answer: "No. append() returns None and mutates the list in place."
---
```

Body: prose + `<PythonExample />` + `<Callout />` + `<TryIt />` blocks.

**Practice exams** live on `/python/practice/` (topic hubs) — lesson pages only use quick **TryIt** checks. Do not add full exams inside lessons.

## SEO lesson template (top traffic pages)

1. **Frontmatter** — `description`, `quickAnswer`, `faqs` (3–4 items)
2. **Why this matters** — 2–3 sentences (or use `seo:apply-top30` from `docs/seo-top-30-meta.json`)
3. Plain-English explanation + analogy
4. Runnable example + line-by-line
5. Common mistake (`Callout`)
6. **TryIt** (1–2 on lesson; full exams on Practice hub)
7. Recap + next lesson

Rendered automatically on each lesson:

- `QuickAnswer` from frontmatter
- `PracticeExamsNote` → chapter on `/python/practice/#chapter-N`
- `SeoFaq` + FAQPage JSON-LD from frontmatter
- Related lessons + breadcrumbs schema

## Try it exercises

```mdx
<TryIt title="Try it yourself" answer="expected output or short answer">
  Instructions for the learner.
</TryIt>
```

## Callouts

```mdx
<Callout variant="note">Neutral extra context.</Callout>
<Callout variant="tip">Helpful shortcut or habit.</Callout>
<Callout variant="warning">Easy mistake to avoid.</Callout>
<Callout variant="danger" title="Optional title">
  Serious pitfall.
</Callout>
```

## Example blocks

Use `<PythonExample />` with a **Run code** button (Skulpt loads on first Run). Do not mention reading time or duration.

## Rules

- `order` must be unique — run `npm run sync:curriculum` after reordering in `docs/curriculum-order.json`
- Never mention duration or reading time
- URL: `/python/<slug>/`

## Bulk SEO metadata

Top-30 list: `docs/seo-top-30-meta.json` · apply with `npm run seo:apply-top30`
