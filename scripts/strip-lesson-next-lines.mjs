#!/usr/bin/env node
/**
 * Remove inline "Next:" / "Next chapter:" navigation from lesson MDX.
 * Footer nav (LessonFooterNav) is the source of truth.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const lessonsDir = path.join(root, "src/content/lessons");

const NEXT_LINE =
  /^(?:- )?(?:Next chapter(?: topic)?:|Next:)\s*.+$/m;
const FINISHED_NEXT =
  /^You finished [^\n]*\.?\s*Next(?: chapter)?:\s*.+$/m;

let changed = 0;

for (const file of fs.readdirSync(lessonsDir).filter((f) => f.endsWith(".mdx"))) {
  const fp = path.join(lessonsDir, file);
  let text = fs.readFileSync(fp, "utf8");
  const before = text;

  text = text.replace(FINISHED_NEXT, "");
  text = text.replace(NEXT_LINE, "");
  // Collapse 3+ blank lines before ## or end
  text = text.replace(/\n{3,}(?=## |\n---|\Z)/g, "\n\n");

  if (text !== before) {
    fs.writeFileSync(fp, text);
    changed++;
    console.log("stripped:", file);
  }
}

console.log(`Done. Updated ${changed} files.`);
