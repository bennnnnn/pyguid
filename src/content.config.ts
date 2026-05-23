import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const subtopicSchema = z.object({
  id: z.string(),
  title: z.string(),
});

const chapters = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/chapters" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    level: z.enum(["beginner", "intermediate"]).default("beginner"),
    subtopics: z.array(subtopicSchema).min(1),
  }),
});

export const collections = { chapters };
