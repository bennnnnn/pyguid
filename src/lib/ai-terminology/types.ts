export type AiTerm = {
  term: string;
  meaning: string;
  /** Beginner-friendly lead sentence before the full definition */
  simple?: string;
  /** Alternate names searchable and shown under the term */
  aliases?: string[];
  /** Related vocabulary matched in search */
  related?: string[];
  /** How the term shows up for Python developers */
  python?: string;
  example?: string;
};

export type AiTerminologySection = {
  id: string;
  title: string;
  intro?: string;
  terms: AiTerm[];
  /** Optional code snippet illustrating Python usage */
  codeExample?: string;
  links?: { label: string; href: string }[];
};

export type AiTerminologyMeta = {
  title: string;
  subtitle: string;
  description: string;
};
