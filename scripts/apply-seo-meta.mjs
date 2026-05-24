#!/usr/bin/env node
/**
 * Apply docs/seo-top-30-meta.json to lesson MDX frontmatter + optional "Why this matters".
 * Usage: node scripts/apply-seo-meta.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const meta = JSON.parse(readFileSync(join(root, "docs/seo-top-30-meta.json"), "utf8"));
const lessonsDir = join(root, "src/content/lessons");

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  return { yaml: match[1], body: match[2] };
}

function upsertYamlField(yaml, key, value, indent = "") {
  const serialized =
    key === "faqs"
      ? `faqs:\n${value
          .map(
            (f) =>
              `  - question: ${JSON.stringify(f.question)}\n    answer: ${JSON.stringify(f.answer)}`,
          )
          .join("\n")}\n`
      : `${key}: ${JSON.stringify(value)}\n`;

  const re = new RegExp(`^${key}:.*(?:\\n(?:  .*)*)*`, "m");
  if (re.test(yaml)) {
    return yaml.replace(re, serialized.trimEnd());
  }
  return `${yaml.trimEnd()}\n${serialized.trimEnd()}`;
}

for (const [slug, entry] of Object.entries(meta.lessons)) {
  const path = join(lessonsDir, `${slug}.mdx`);
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    console.error(`MISSING ${slug}.mdx`);
    process.exit(1);
  }

  const parsed = parseFrontmatter(text);
  if (!parsed) {
    console.error(`BAD FRONTMATTER ${slug}`);
    process.exit(1);
  }

  let yaml = parsed.yaml;
  let body = parsed.body;

  if (entry.description) yaml = upsertYamlField(yaml, "description", entry.description);
  if (entry.quickAnswer) yaml = upsertYamlField(yaml, "quickAnswer", entry.quickAnswer);
  if (entry.faqs) yaml = upsertYamlField(yaml, "faqs", entry.faqs);

  if (entry.whyMatters && !body.includes("## Why this matters")) {
    body = `## Why this matters\n\n${entry.whyMatters}\n\n${body}`;
  }

  writeFileSync(path, `---\n${yaml}\n---\n\n${body}`);
  console.log(`Updated ${slug}`);
}

console.log(`\nApplied SEO meta to ${Object.keys(meta.lessons).length} lessons.`);
