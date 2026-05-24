import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const lessons = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/lessons" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    chapter: z.number(),
    chapterTitle: z.string(),
    /** Optional sidebar group inside a chapter (e.g. "Strings", "Lists") */
    section: z.string().optional(),
    level: z.enum(["beginner", "intermediate"]).default("beginner"),
    /** One-sentence direct answer for SEO snippets and scanners */
    quickAnswer: z.string().optional(),
    /** FAQ for page body + FAQPage JSON-LD */
    faqs: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional(),
  }),
});

export const collections = { lessons };
