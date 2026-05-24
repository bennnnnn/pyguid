// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { getQuizTopicForChapter, quizUrl } from "./src/lib/quiz-topics.ts";

/** Legacy /python/practice/{chapter}/ URLs → topic quizzes */
const practiceChapterRedirects = Object.fromEntries(
  Array.from({ length: 31 }, (_, i) => i + 1).map((chapter) => {
    const topic = getQuizTopicForChapter(chapter);
    return [
      `/python/practice/${chapter}/`,
      topic ? quizUrl(topic.slug) : "/python/quiz/",
    ];
  }),
);

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? "https://bennnnnn.github.io/pyguid",
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap()],
  redirects: {
    ...practiceChapterRedirects,
    "/learn/": "/python/",
    "/python/roadmap/": "/python/",
    "/cheatsheet/": "/python/reference/",
    "/python/dict-methods/": "/python/dict-loops/",
    "/python/user-input/": "/python/input-basics/",
    "/python/practice/": "/python/quiz/",
    "/python/quiz/getting-started/": "/python/quiz/what-is-python/",
    "/python/quiz/functional-python/": "/python/quiz/advanced-functions/",
    "/python/quiz/dataclasses-dates/": "/python/quiz/standard-library/",
    "/python/quiz/logging-regex/": "/python/quiz/standard-library/",
    "/python/multi-file-cli-capstone/": "/python/multi-file-cli-project/",
    "/python/reference/what-is-python/": "/python/reference/print-and-errors/",
    "/python/reference/what-is-python/print/":
      "/python/reference/print-and-errors/show-output-with-print/",
    "/python/reference/what-is-python/py-file/":
      "/python/reference/print-and-errors/run-py-file/",
    "/python/reference/what-is-python/repl/":
      "/python/reference/print-and-errors/use-the-interactive-repl/",
    "/python/reference/print-and-errors/print/":
      "/python/reference/print-and-errors/show-output-with-print/",
    "/python/reference/print-and-errors/py-file/":
      "/python/reference/print-and-errors/run-py-file/",
    "/python/reference/print-and-errors/repl/":
      "/python/reference/print-and-errors/use-the-interactive-repl/",
    "/python/reference/variables/name-value/":
      "/python/reference/variables/create-a-variable/",
    "/python/reference/variables/name-name-1/":
      "/python/reference/variables/change-a-variable-s-value/",
    "/python/reference/loops/range/": "/python/reference/loops/count-with-range/",
    "/python/reference/loops/range-2/":
      "/python/reference/loops/range-with-start-and-stop/",
  },
  markdown: {
    shikiConfig: {
      theme: "dracula",
    },
  },
});
