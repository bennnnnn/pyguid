import { createHighlighter, type Highlighter, type BundledTheme } from "shiki";

export type CodeTheme = "dracula" | "catppuccin-latte";

const THEMES: BundledTheme[] = ["dracula", "catppuccin-latte"];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: THEMES,
      langs: ["python", "bash"],
    });
  }
  return highlighterPromise;
}

/**
 * Highlight Python source at build time (Shiki). Use in Astro frontmatter.
 */
export type HighlightLanguage = "python" | "bash";

export async function highlightCode(
  code: string,
  lang: HighlightLanguage = "python",
  theme: CodeTheme = "dracula",
): Promise<string> {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code.trim(), {
    lang,
    theme,
  });
}

/** @deprecated Use highlightCode */
export async function highlightPython(
  code: string,
  theme: CodeTheme = "dracula",
): Promise<string> {
  return highlightCode(code, "python", theme);
}
