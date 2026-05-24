#!/usr/bin/env node
/**
 * Remove <TryIt>...</TryIt> blocks from lesson MDX (users cannot write in them yet).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TRYIT = /<TryIt[\s\S]*?<\/TryIt>\s*\n?/g;

function stripDir(dir) {
  let changed = 0;
  if (!fs.existsSync(dir)) return changed;
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"))) {
    const fp = path.join(dir, file);
    const before = fs.readFileSync(fp, "utf8");
    const after = before.replace(TRYIT, "").replace(/\n{3,}/g, "\n\n");
    if (after !== before) {
      fs.writeFileSync(fp, after);
      changed++;
    }
  }
  return changed;
}

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessons = stripDir(path.join(root, "src/content/lessons"));
const archive = stripDir(path.join(root, "src/archive/lessons"));
console.log(`Removed TryIt from ${lessons} lessons, ${archive} archive files.`);
