# Content authoring

## Chapter file

Path: `src/content/chapters/NN-slug.mdx`

```yaml
---
title: "Chapter title"
description: "One line for SEO and chapter cards."
order: 5
level: beginner
subtopics:
  - id: my-topic-id
    title: "Human-readable sub-topic title"
---
```

Rules:

- `order` is numeric sort key (use `01-`, `02-` prefixes in filename — the file stem becomes the URL id, e.g. `01-hello-python`).
- Every `subtopics[].id` must match an `<h2 id="…">` in the body.
- Do **not** mention duration, hours, or reading time anywhere.

## Sub-topic headings

```mdx
<h2 id="my-topic-id">Human-readable title</h2>

Paragraph text…

<PythonExample
  filename="example.py"
  code={`print("hello")`}
/>
```

## Python examples

- `code` is a template literal; use `\n` for new lines in multi-line snippets.
- Run uses Skulpt in the browser (subset of Python). Avoid unsupported stdlib.
- Keep examples focused on one idea per block.

## Checklist for new chapter

- [ ] Frontmatter `subtopics` matches all `<h2 id>` sections
- [ ] At least one `PythonExample` per sub-topic
- [ ] Prev/next navigation works (automatic via `order`)
- [ ] Sidebar lists all sub-topics (automatic from frontmatter)
