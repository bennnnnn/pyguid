#!/usr/bin/env node
/**
 * Remove quickAnswer and faqs from lesson frontmatter (not rendered on lesson pages).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const lessonsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src/content/lessons",
);

function stripSeoFields(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return content;

  let fm = match[1];
  const body = match[2];

  fm = fm.replace(/^quickAnswer:.*(?:\r?\n(?![\w-]+:).*)*/m, "");
  fm = fm.replace(/^faqs:\r?\n(?:(?:  - question:.*\r?\n    answer:.*\r?\n)+)/m, "");
  fm = fm.replace(/\n{3,}/g, "\n").replace(/\n$/, "");

  return `---\n${fm}\n---\n${body}`;
}

let changed = 0;
for (const file of fs.readdirSync(lessonsDir).filter((f) => f.endsWith(".mdx"))) {
  const fp = path.join(lessonsDir, file);
  const before = fs.readFileSync(fp, "utf8");
  const after = stripSeoFields(before);
  if (after !== before) {
    fs.writeFileSync(fp, after);
    changed++;
  }
}
console.log(`Stripped SEO frontmatter from ${changed} files.`);
