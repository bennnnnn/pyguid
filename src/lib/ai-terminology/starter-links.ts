import { AI_TERM_STARTER_100 } from "./starter-terms";
import { aiTerminologySectionUrl, termAnchorsForSection } from "./helpers";
import { AI_TERMINOLOGY_SECTIONS } from "./sections";

export type StarterTermLink = {
  term: string;
  sectionId: string;
  sectionTitle: string;
  href: string;
};

export function buildStarterTermLinks(): StarterTermLink[] {
  return AI_TERM_STARTER_100.map((item) => {
    const section = AI_TERMINOLOGY_SECTIONS.find((s) => s.id === item.sectionId);
    const sectionTitle = section?.title ?? item.sectionId;
    const base = aiTerminologySectionUrl(item.sectionId);
    if (!section) {
      return { term: item.term, sectionId: item.sectionId, sectionTitle, href: base };
    }
    const anchors = termAnchorsForSection(section.id, section.terms);
    const index = section.terms.findIndex((t) => t.term === item.term);
    const href = index >= 0 ? `${base}#${anchors[index]}` : base;
    return { term: item.term, sectionId: item.sectionId, sectionTitle, href };
  });
}
