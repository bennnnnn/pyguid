#!/usr/bin/env node
/**
 * Fail if the legacy public practice route folder exists.
 * Quizzes live at src/pages/python/quiz/; /python/practice/* redirects in astro.config.mjs.
 */
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const practiceDir = join(root, "src/pages/python/practice");

if (existsSync(practiceDir)) {
  console.error(
    "Legacy route found: src/pages/python/practice/\n" +
      "Remove it and use src/pages/python/quiz/ instead. Keep redirects in astro.config.mjs only.",
  );
  process.exit(1);
}

console.log("OK: no src/pages/python/practice/ route folder");
