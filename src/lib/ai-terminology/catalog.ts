import { AI_TERMINOLOGY_SECTIONS } from "./sections";
import type { AiTerminologySection } from "./types";

/** Topics removed from the public glossary (math, vision, classic ML splits, etc.). */
export const AI_TERM_UNPUBLISHED_SECTION_IDS = new Set([
  "python-ecosystem",
  "supervised",
  "unsupervised",
  "computer-vision",
  "speech",
  "data-science",
  "math",
]);

export type AiTerminologyPart = {
  id: string;
  title: string;
  sectionIds: string[];
};

/**
 * Sidebar, index, and pager order — trending topics first (agents, MCP, RAG), foundations last.
 */
export const AI_TERMINOLOGY_SECTION_ORDER: string[] = [
  "agents",
  "mcp",
  "rag",
  "safety",
  "prompt-engineering",
  "llm",
  "embeddings",
  "coding",
  "inference",
  "fine-tuning",
  "observability",
  "product",
  "generative-ai",
  "model-types",
  "nlp",
  "mlops",
  "deep-learning",
  "training",
  "evaluation",
  "data-terms",
  "big-picture",
  "ml-basics",
];

/** Legacy part groupings (not shown in sidebar). */
export const AI_TERMINOLOGY_PARTS: AiTerminologyPart[] = [
  {
    id: "agents-stack",
    title: "Agents & grounding",
    sectionIds: ["agents", "rag", "safety", "mcp"],
  },
  {
    id: "using-llms",
    title: "Using LLMs",
    sectionIds: ["prompt-engineering", "embeddings", "fine-tuning", "inference"],
  },
  {
    id: "shipping",
    title: "Build & operate",
    sectionIds: ["coding", "observability", "product", "mlops"],
  },
  {
    id: "models",
    title: "Models & training",
    sectionIds: [
      "model-types",
      "generative-ai",
      "deep-learning",
      "llm",
      "nlp",
      "training",
      "evaluation",
    ],
  },
  {
    id: "foundations",
    title: "Foundations",
    sectionIds: ["big-picture", "data-terms", "ml-basics"],
  },
];

export function isAiTerminologySectionPublished(sectionId: string): boolean {
  return !AI_TERM_UNPUBLISHED_SECTION_IDS.has(sectionId);
}

export function getPublishedAiTerminologySections(): AiTerminologySection[] {
  const order = AI_TERMINOLOGY_SECTION_ORDER;
  const published = AI_TERMINOLOGY_SECTIONS.filter((section) =>
    isAiTerminologySectionPublished(section.id),
  );
  const byId = new Map(published.map((section) => [section.id, section]));
  const ordered: AiTerminologySection[] = [];

  for (const id of order) {
    const section = byId.get(id);
    if (section) ordered.push(section);
  }

  for (const section of published) {
    if (!ordered.some((s) => s.id === section.id)) ordered.push(section);
  }

  return ordered;
}

export type AiTerminologyPartWithSections = AiTerminologyPart & {
  sections: AiTerminologySection[];
};

export function getAiTerminologyPartsWithSections(): AiTerminologyPartWithSections[] {
  const byId = new Map(getPublishedAiTerminologySections().map((s) => [s.id, s]));

  return AI_TERMINOLOGY_PARTS.map((part) => ({
    ...part,
    sections: part.sectionIds
      .map((id) => byId.get(id))
      .filter((s): s is AiTerminologySection => s != null),
  })).filter((part) => part.sections.length > 0);
}
