import { AI_TERMINOLOGY_SECTIONS } from "./sections";
import type { AiTerminologySection } from "./types";

/**
 * Sidebar navigation order — hot builder topics first, foundations later.
 * Does not affect study order, index cards, or prev/next pager.
 */
export const AI_TERM_SIDEBAR_ORDER: string[] = [
  "agents",
  "mcp",
  "rag",
  "llm",
  "prompt-engineering",
  "embeddings",
  "fine-tuning",
  "inference",
  "coding",
  "observability",
  "safety",
  "generative-ai",
  "model-types",
  "product",
  "big-picture",
  "python-ecosystem",
  "data-terms",
  "ml-basics",
  "supervised",
  "unsupervised",
  "training",
  "evaluation",
  "deep-learning",
  "nlp",
  "computer-vision",
  "speech",
  "data-science",
  "mlops",
  "math",
];

export function getAiTerminologySectionsForSidebar(): AiTerminologySection[] {
  const byId = new Map(AI_TERMINOLOGY_SECTIONS.map((section) => [section.id, section]));
  const ordered: AiTerminologySection[] = [];

  for (const id of AI_TERM_SIDEBAR_ORDER) {
    const section = byId.get(id);
    if (section) ordered.push(section);
  }

  const listed = new Set(AI_TERM_SIDEBAR_ORDER);
  for (const section of AI_TERMINOLOGY_SECTIONS) {
    if (!listed.has(section.id)) ordered.push(section);
  }

  return ordered;
}
