#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const lessonsDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "src/content/lessons",
);

for (const file of fs.readdirSync(lessonsDir).filter((f) => f.endsWith(".mdx"))) {
  const fp = path.join(lessonsDir, file);
  let text = fs.readFileSync(fp, "utf8");
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) continue;

  let fm = m[1];
  const body = m[2];
  const cleaned = fm
    .split(/\r?\n/)
    .filter((line) => !/^\s{2}- question:/.test(line) && !/^\s{4}answer:/.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n")
    .replace(/\n$/, "");

  const next = `---\n${cleaned}\n---\n${body}`;
  if (next !== text) {
    fs.writeFileSync(fp, next);
    console.log("fixed:", file);
  }
}
