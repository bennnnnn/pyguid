/** @typedef {{ quickAnswer: string; description: string; body: string }} LessonContent */

export function slugifyTitle(title) {
  return title
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[./]/g, " ")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function lessonKey(sectionId, lessonTitle) {
  return `${sectionId}:${slugifyTitle(lessonTitle)}`;
}

/** @param {string} code */
export function py(code) {
  return "```python\n" + code.trim() + "\n```";
}

/** @param {string} code */
export function bash(code) {
  return "```bash\n" + code.trim() + "\n```";
}

/** @param {string} text */
export function h2(text) {
  return `## ${text}`;
}

/** @param {string} text */
export function h3(text) {
  return `### ${text}`;
}

/** @param {string} text */
export function p(text) {
  return text;
}

/** @param {string[]} items */
export function ul(items) {
  return items.map((i) => `- ${i}`).join("\n");
}

/** @param {string} variant @param {string} text */
export function callout(variant, text) {
  return `<Callout variant="${variant}">\n\n${text}\n\n</Callout>`;
}

/** @param {Array<string | undefined | false>} parts */
export function mdx(...parts) {
  return parts.filter(Boolean).join("\n\n");
}

/**
 * @param {string} title
 * @param {string} sectionTitle
 * @param {LessonContent} content
 */
export function lesson(title, sectionTitle, content) {
  const description =
    content.description ??
    `Learn ${title.toLowerCase()} in FastAPI — ${sectionTitle} on PyGuide.`;
  return {
    quickAnswer: content.quickAnswer,
    description,
    body: content.body,
  };
}
