#!/usr/bin/env node
/**
 * Remap practice exam JSON files after curriculum v11 chapter renumbering.
 * Old chapter -> new chapter (best fit). Run from repo root.
 */
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src/data/practice-exams");

/** @type {Record<number, number>} */
const OLD_TO_NEW = {
  1: 1,
  2: 3,
  3: 5,
  4: 6,
  5: 8,
  6: 9,
  7: 10,
  8: 11,
  9: 12,
  10: 13,
  11: 14,
  12: 18,
  13: 16,
  14: 22,
  15: 17,
  16: 28,
  17: 29,
  18: 23,
  19: 27,
  20: 27,
  21: 27,
  22: 27,
  25: 31,
};

/** Copy old exam content to new chapter file (merge if duplicate target). */
const byNew = new Map();

for (const file of readdirSync(dir)) {
  const m = file.match(/^chapter-(\d+)\.json$/);
  if (!m) continue;
  const oldCh = Number(m[1]);
  const newCh = OLD_TO_NEW[oldCh];
  if (!newCh) continue;
  const exam = JSON.parse(readFileSync(join(dir, file), "utf8"));
  if (!byNew.has(newCh)) {
    byNew.set(newCh, exam);
  }
}

/** Additional exams from splits — use closest source */
const extras = [
  { from: 3, to: 7, titleSuffix: "Strings" },
  { from: 4, to: 8, titleSuffix: "Booleans and Conditions" },
  { from: 11, to: 15, titleSuffix: "Scope" },
  { from: 11, to: 20, titleSuffix: "Built-in Functions" },
  { from: 11, to: 26, titleSuffix: "Type Hints" },
  { from: 12, to: 19, titleSuffix: "Packages and Imports" },
  { from: 12, to: 30, titleSuffix: "Writing Clean Python" },
  { from: 7, to: 21, titleSuffix: "Comprehensions" },
  { from: 18, to: 24, titleSuffix: "Iterators and Generators" },
  { from: 18, to: 25, titleSuffix: "Decorators" },
  { from: 1, to: 2, titleSuffix: "Print and Errors" },
];

for (const { from, to, titleSuffix } of extras) {
  const path = join(dir, `chapter-${from}.json`);
  try {
    const exam = JSON.parse(readFileSync(path, "utf8"));
    exam.chapter = to;
    exam.chapterTitle = titleSuffix;
    exam.title = `${titleSuffix} Quiz`;
    byNew.set(to, exam);
  } catch {
    /* skip */
  }
}

// Remove all old chapter files
for (const file of readdirSync(dir)) {
  if (file.match(/^chapter-\d+\.json$/)) unlinkSync(join(dir, file));
}

// Write new 1-31 where we have content
const titles = {
  1: "What is Python?",
  2: "Print, Comments, and Errors",
  3: "Variables",
  5: "Data Types",
  6: "Numbers and Operators",
  7: "Strings",
  8: "Booleans and Conditions",
  9: "Loops",
  10: "Lists",
  11: "Tuples",
  12: "Sets",
  13: "Dictionaries",
  14: "Functions",
  15: "Scope",
  16: "Error Handling",
  17: "Files",
  18: "Modules",
  19: "Packages and Imports",
  20: "Useful Built-in Functions",
  21: "Comprehensions",
  22: "Object-Oriented Python",
  23: "Advanced Functions",
  24: "Iterators and Generators",
  25: "Decorators",
  26: "Type Hints",
  27: "Python Standard Library",
  28: "Debugging Python Code",
  29: "Testing Python Code",
  30: "Writing Clean Python",
  31: "Python Mini Programs",
};

for (const [ch, exam] of [...byNew.entries()].sort((a, b) => a[0] - b[0])) {
  exam.chapter = ch;
  if (titles[ch]) {
    exam.chapterTitle = titles[ch];
    if (!exam.title.includes("Quiz")) exam.title = `${titles[ch]} Quiz`;
  }
  writeFileSync(join(dir, `chapter-${ch}.json`), JSON.stringify(exam, null, 2) + "\n");
  console.log(`Wrote chapter-${ch}.json`);
}

console.log(`\n${byNew.size} quiz JSON files (chapters without exams show Coming soon).`);
