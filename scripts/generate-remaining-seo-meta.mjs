#!/usr/bin/env node
/**
 * Generate SEO meta for lessons missing quickAnswer.
 * Usage: node scripts/generate-remaining-seo-meta.mjs [output.json]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = process.argv[2] ?? "docs/seo-batch3-meta.json";
const outPath = outFile.startsWith("/") ? outFile : join(root, outFile);
const lessonsDir = join(root, "src/content/lessons");

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const yaml = match[1];
  const get = (key) => {
    const m = yaml.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, "m"));
    return m ? m[1].trim() : "";
  };
  return {
    slug: "",
    title: get("title"),
    description: get("description"),
    chapterTitle: get("chapterTitle"),
    level: get("level") || "beginner",
    hasSeo: /^quickAnswer:/m.test(yaml),
  };
}

function trimToLength(text, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 3).replace(/\s+\S*$/, "");
  return `${cut}...`;
}

function expandDescription(title, description, chapterTitle) {
  if (description.length >= 140) return trimToLength(description);
  const topic = title.replace(/^Python\s+/i, "").replace(/\(\)$/, "");
  const parts = [
    description.replace(/\.$/, ""),
    `Learn ${topic} in this ${chapterTitle} lesson with runnable Python examples on PyGuide.`,
    "Beginner-friendly explanations — no install required.",
  ];
  return trimToLength(parts.join(" "));
}

function buildQuickAnswer(title, description) {
  const topic = title.replace(/\(\)$/, "");
  if (description.length >= 40) {
    return trimToLength(`${description.replace(/\.$/, "")}. This PyGuide lesson shows ${topic} with examples you can run in the browser.`, 220);
  }
  return trimToLength(
    `${topic} in Python — this lesson explains the idea with short examples and common beginner mistakes to avoid.`,
    220,
  );
}

function buildWhyMatters(title, chapterTitle) {
  const topic = title.replace(/\(\)$/, "");
  return trimToLength(
    `${topic} shows up throughout ${chapterTitle} and later chapters. Understanding it here makes the next lessons easier and helps you read real Python code with confidence. PyGuide keeps each page focused on one idea so you can practice without getting lost.`,
    320,
  );
}

const lessons = {};
const files = readdirSync(lessonsDir).filter((f) => f.endsWith(".mdx"));

for (const file of files) {
  const slug = file.replace(/\.mdx$/, "");
  const text = readFileSync(join(lessonsDir, file), "utf8");
  const fm = parseFrontmatter(text);
  if (!fm || fm.hasSeo) continue;

  const { title, description, chapterTitle } = fm;
  lessons[slug] = {
    description: expandDescription(title, description, chapterTitle),
    quickAnswer: buildQuickAnswer(title, description),
    whyMatters: buildWhyMatters(title, chapterTitle),
  };
}

const output = { lessons };
writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${Object.keys(lessons).length} lessons to ${outPath}`);
