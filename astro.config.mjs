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
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
