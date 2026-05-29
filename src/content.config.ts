import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const lessons = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/lessons" }),
  schema: z.object({
    title: z.string(),
    /** Short label in the tutorial sidebar (defaults to title) */
    navTitle: z.string().optional(),
    description: z.string(),
    order: z.number(),
    chapter: z.number(),
    chapterTitle: z.string(),
    /** Curriculum part 1–11 */
    part: z.number().optional(),
    partTitle: z.string().optional(),
    /** Subtopic group inside a chapter (sidebar + tutorials index) */
    section: z.string().optional(),
    level: z.enum(["beginner", "intermediate"]).default("beginner"),
    /** One-sentence direct answer for SEO snippets and scanners */
    quickAnswer: z.string().optional(),
  }),
});

const fastapiLessons = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/fastapi-lessons" }),
  schema: z.object({
    title: z.string(),
    navTitle: z.string().optional(),
    description: z.string(),
    order: z.number(),
    sectionId: z.string(),
    sectionTitle: z.string(),
    sectionOrder: z.number(),
    lessonOrder: z.number(),
    level: z.enum(["beginner", "intermediate"]).default("beginner"),
    quickAnswer: z.string().optional(),
  }),
});

export const collections = { lessons, "fastapi-lessons": fastapiLessons };
