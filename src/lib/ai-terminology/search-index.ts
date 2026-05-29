import { getPublishedAiTerminologySections } from "./catalog";
import { termSearchBlob } from "./enrich";
import { aiTerminologySectionUrl, termAnchorsForSection } from "./helpers";

export type AiTermSearchHit = {
  term: string;
  meaning: string;
  simple?: string;
  aliases: string[];
  related: string[];
  searchText: string;
  sectionId: string;
  sectionTitle: string;
  href: string;
};

export type AiTermSectionSearchRow = {
  id: string;
  title: string;
  intro: string;
  termCount: number;
  href: string;
};

export function buildAiTerminologySearchIndex(): AiTermSearchHit[] {
  const hits: AiTermSearchHit[] = [];
  for (const section of getPublishedAiTerminologySections()) {
    const anchors = termAnchorsForSection(section.id, section.terms);
    const base = aiTerminologySectionUrl(section.id);
    section.terms.forEach((entry, index) => {
      hits.push({
        term: entry.term,
        meaning: entry.meaning,
        simple: entry.simple,
        aliases: entry.aliases ?? [],
        related: entry.related ?? [],
        searchText: termSearchBlob(entry, section.title),
        sectionId: section.id,
        sectionTitle: section.title,
        href: `${base}#${anchors[index]}`,
      });
    });
  }
  return hits;
}

export function buildAiTerminologySectionSearchRows(): AiTermSectionSearchRow[] {
  return getPublishedAiTerminologySections().map((section) => ({
    id: section.id,
    title: section.title,
    intro: section.intro ?? "",
    termCount: section.terms.length,
    href: aiTerminologySectionUrl(section.id),
  }));
}
