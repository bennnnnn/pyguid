#!/usr/bin/env node
/**
 * Apply chapter + order from docs/curriculum-order.json to every lesson MDX.
 * Usage: node scripts/sync-curriculum.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const lessonsDir = join(root, "src/content/lessons");
const config = JSON.parse(readFileSync(join(root, "docs/curriculum-order.json"), "utf8"));

const entries = config.lessons;
const slugSet = new Set(entries.map((e) => e.slug));

for (const file of readdirSync(lessonsDir)) {
  if (!file.endsWith(".mdx")) continue;
  const slug = file.replace(/\.mdx$/, "");
  if (!slugSet.has(slug)) {
    console.warn(
      `WARN: ${slug} not in curriculum-order.json — move to src/archive/lessons or add to curriculum`,
    );
  }
}

for (const [i, entry] of entries.entries()) {
  const path = join(lessonsDir, `${entry.slug}.mdx`);
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    console.error(`MISSING: ${entry.slug}.mdx`);
    process.exit(1);
  }

  const order = i + 1;
  let updated = text
    .replace(/^order:\s*\d+\s*$/m, `order: ${order}`)
    .replace(/^chapter:\s*\d+\s*$/m, `chapter: ${entry.chapter}`)
    .replace(/^chapterTitle:\s*.+$/m, `chapterTitle: "${entry.chapterTitle}"`);

  if (entry.section) {
    if (/^section:/m.test(updated)) {
      updated = updated.replace(/^section:\s*.+$/m, `section: "${entry.section}"`);
    } else {
      updated = updated.replace(
        /^(chapterTitle:.+\n)/m,
        `$1section: "${entry.section}"\n`,
      );
    }
  } else {
    updated = updated.replace(/^section:\s*.+\n/m, "");
  }

  writeFileSync(path, updated);
  console.log(`${order.toString().padStart(3)}  ch${entry.chapter}  ${entry.slug}`);
}

console.log(`\nSynced ${entries.length} lessons.`);
