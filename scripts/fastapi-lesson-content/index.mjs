import { lessonKey } from "./core.mjs";
import { stripBoilerplate } from "./cleanup.mjs";
import { SECTION_INTROS } from "./section-intros.mjs";
import { LESSONS as batch1 } from "./batch-1.mjs";
import { LESSONS as batch2 } from "./batch-2.mjs";
import { LESSONS as batch3 } from "./batch-3.mjs";
import { LESSONS as batch4 } from "./batch-4.mjs";
import { LESSONS as batch5 } from "./batch-5.mjs";

const ALL_LESSONS = { ...batch1, ...batch2, ...batch3, ...batch4, ...batch5 };

const TOTAL_LESSONS = 253;

/** @typedef {{ quickAnswer: string; description: string; body: string }} LessonContent */

/**
 * @param {{
 *   sectionId: string;
 *   sectionTitle: string;
 *   lessonOrder: number;
 *   globalOrder: number;
 *   nextLessonTitle?: string | null;
 * }} ctx
 */
function buildLessonFrame(ctx) {
  const parts = [];

  if (ctx.globalOrder === 1) {
    parts.push(
      `<Callout variant="tip">\n\n**Before you start:** You should be comfortable with [Python basics](/python/)—functions, types, and virtual environments. This track takes you from zero FastAPI knowledge through a production-ready mental model.\n\n</Callout>`,
    );
  }

  if (ctx.lessonOrder === 1 && SECTION_INTROS[ctx.sectionId]) {
    parts.push(
      `<Callout variant="note">\n\n**Topic: ${ctx.sectionTitle}** — ${SECTION_INTROS[ctx.sectionId]}\n\n</Callout>`,
    );
  }

  return parts.join("\n\n");
}

/**
 * @param {{
 *   nextLessonTitle?: string | null;
 *   globalOrder: number;
 * }} ctx
 */
function buildLessonClose(ctx) {
  const parts = [];

  if (ctx.nextLessonTitle) {
    parts.push(
      `## Up next\n\nWhen you are ready, continue with **${ctx.nextLessonTitle}** (use **Next** below). Each lesson builds on the previous one in this track.`,
    );
  }

  if (ctx.globalOrder === TOTAL_LESSONS) {
    parts.push(
      `## You completed the FastAPI track\n\nYou worked through the full path: setup, HTTP and Pydantic, databases, authentication, testing, deployment, and advanced patterns. **What to do next:** build one small project (for example a todo or notes API with login, CRUD, and tests), deploy it with Docker, and keep this site open as reference while you code on your machine.`,
    );
  }

  return parts.join("\n\n");
}

function normalizeBody(body) {
  return stripBoilerplate(body)
    .replace(/^## explanation$/gm, "## How it works")
    .replace(/^## Core idea$/gm, "## How it works");
}

/**
 * @param {string} sectionId
 * @param {string} lessonTitle
 * @param {{
 *   sectionTitle: string;
 *   lessonOrder: number;
 *   globalOrder: number;
 *   nextLessonTitle?: string | null;
 *   prevLessonTitle?: string | null;
 * }} ctx
 * @returns {LessonContent}
 */
export function getLessonContent(sectionId, lessonTitle, ctx) {
  const key = lessonKey(sectionId, lessonTitle);
  const found = ALL_LESSONS[key] ?? fallbackContent(lessonTitle, ctx.sectionTitle);

  const frame = buildLessonFrame(ctx);
  const core = normalizeBody(found.body);
  const close = buildLessonClose(ctx);

  const body = [frame, core, close].filter(Boolean).join("\n\n");

  return {
    quickAnswer: found.quickAnswer,
    description: found.description,
    body,
  };
}

/**
 * @param {string} lessonTitle
 * @param {string} sectionTitle
 * @returns {LessonContent}
 */
function fallbackContent(lessonTitle, sectionTitle) {
  const topic = lessonTitle.replace(/`/g, "");
  return {
    quickAnswer: `${topic} is a core FastAPI concept in the ${sectionTitle} section of this track.`,
    description: `Learn ${topic.toLowerCase()} in FastAPI — ${sectionTitle} on PyGuide.`,
    body: [
      "## Why this matters",
      "",
      `**${topic}** appears throughout real FastAPI projects in **${sectionTitle}**. Skipping it makes later lessons harder because patterns stack on each other.`,
      "",
      "## How it works",
      "",
      `Focus on **${topic}**: the problem it solves, the FastAPI tools involved, and one minimal example you can run locally with Uvicorn.`,
      "",
      "## Try it locally",
      "",
      "Copy the example into `main.py`, install dependencies in a virtual environment, and hit the route from `/docs` or curl. Change one field at a time and observe validation errors—that is how the framework teaches you the rules.",
      "",
      "## Recap",
      "",
      `- **${topic}** is part of **${sectionTitle}**`,
      "- Practice on your machine with Uvicorn, not only by reading",
      "- Use **Next** to stay in order through the track",
    ].join("\n"),
  };
}

export { ALL_LESSONS };
