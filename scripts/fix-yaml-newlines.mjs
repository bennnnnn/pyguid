#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const meta = JSON.parse(readFileSync(join(root, "docs/seo-top-30-meta.json"), "utf8"));

for (const slug of Object.keys(meta.lessons)) {
  const path = join(root, "src/content/lessons", `${slug}.mdx`);
  let text = readFileSync(path, "utf8");
  text = text.replace(/"order:/g, '"\norder:');
  writeFileSync(path, text);
  console.log("fixed", slug);
}
