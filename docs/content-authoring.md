# Content authoring (W3Schools-style)

## One page = one topic

Path: `src/content/lessons/your-slug.mdx`

```yaml
---
title: "Python Variables" # Sidebar + H1
description: "SEO description"
order: 5 # Global order (prev/next)
chapter: 2 # Sidebar chapter number
chapterTitle: "Variables" # Sidebar chapter header
section: "Strings" # Optional: nested topic (e.g. string methods)
level: beginner
---
```

Body: prose + `<PythonExample />` + `<Callout />` + `<TryIt />` blocks. Short `##` subheadings are fine when they help scan the page.

## Beginner teaching flow

1. Tiny analogy or story
2. One new idea
3. Short code + **Run**
4. Explain each line
5. Common mistake (`Callout` warning/danger)
6. `<TryIt>` with hidden answer
7. Recap + next lesson link

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

Variants: `note`, `tip`, `warning`, `danger`.

## Example blocks

Use `<PythonExample />` with a **Run code** button (Skulpt in the browser). Do not mention reading time or duration.

## Rules

- `order` must be unique and sequential for prev/next navigation.
- `chapter` + `chapterTitle` group items in the left sidebar.
- Never mention duration or reading time.

## Example

```mdx
---
title: "Python Lists"
description: "Create and use lists in Python."
order: 17
chapter: 5
chapterTitle: "Lists"
level: beginner
---

Python lists store multiple values.

<PythonExample
  filename="lists.py"
  code={`fruits = ["apple", "banana"]
print(fruits[0])`}
/>
```

URL: `/python/lists/` (filename stem = id).
