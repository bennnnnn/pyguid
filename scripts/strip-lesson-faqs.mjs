#!/usr/bin/env node
/**
 * Remove faqs blocks from lesson MDX frontmatter.
 * Usage: node scripts/strip-lesson-faqs.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lessonsDir = join(root, "src/content/lessons");

const faqsBlockRe = /\nfaqs:\n(?:  - question:.*\n    answer:.*\n)+/g;

let updated = 0;
for (const file of readdirSync(lessonsDir).filter((f) => f.endsWith(".mdx"))) {
  const path = join(lessonsDir, file);
  const text = readFileSync(path, "utf8");
  if (!faqsBlockRe.test(text)) continue;
  faqsBlockRe.lastIndex = 0;
  writeFileSync(path, text.replace(faqsBlockRe, "\n"));
  updated++;
  console.log(`Stripped faqs: ${file}`);
}

console.log(`\nDone. Updated ${updated} files.`);
