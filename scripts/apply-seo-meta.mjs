#!/usr/bin/env node
/**
 * Apply SEO meta JSON to lesson MDX frontmatter + optional "Why this matters".
 * Usage: node scripts/apply-seo-meta.mjs [docs/seo-top-30-batch2-meta.json]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const metaFile = process.argv[2] ?? "docs/seo-top-30-meta.json";
const metaPath = metaFile.startsWith("/") ? metaFile : join(root, metaFile);
const meta = JSON.parse(readFileSync(metaPath, "utf8"));
const lessonsDir = join(root, "src/content/lessons");

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return null;
  return { yaml: match[1], body: match[2] };
}

function upsertYamlField(yaml, key, value, indent = "") {
  const serialized = `${key}: ${JSON.stringify(value)}\n`;

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

  if (entry.whyMatters && !body.includes("## Why this matters")) {
    body = `## Why this matters\n\n${entry.whyMatters}\n\n${body}`;
  }

  writeFileSync(path, `---\n${yaml}\n---\n\n${body}`);
  console.log(`Updated ${slug}`);
}

console.log(`\nApplied SEO meta to ${Object.keys(meta.lessons).length} lessons.`);
