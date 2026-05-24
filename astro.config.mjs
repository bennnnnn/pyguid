// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL ?? "https://bennnnnn.github.io/pyguid",
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap()],
  redirects: {
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
