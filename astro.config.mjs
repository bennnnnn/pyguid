// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://pyguide.example",
  trailingSlash: "always",
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx(), sitemap()],
  redirects: {
    "/learn/": "/python/",
    "/cheatsheet/": "/python/reference/",
  },
  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
