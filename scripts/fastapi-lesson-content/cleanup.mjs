/** Strip repetitive boilerplate from lesson bodies (applied at generate time). */

const BOILERPLATE_PATTERNS = [
  /\n## In practice\n\nApply this on your machine:[\s\S]*?better than rereading alone\.\n/g,
  /\n### In practice\n\nApply this on your machine:[\s\S]*?better than rereading alone\.\n/g,
  /\n\nPractice this topic in \/docs with Try it out, then mirror the same request in curl or your HTTP client so you see headers and status codes outside the browser UI\./g,
  /\n\nUse \*\*Back\*\* and \*\*Next\*\* below to move through the lessons in order, or open the \[FastAPI roadmap\]\(\/fastapi\/\) to jump to another topic\./g,
];

export function stripBoilerplate(body) {
  let result = body;
  for (const pattern of BOILERPLATE_PATTERNS) {
    result = result.replace(pattern, "\n");
  }
  return result.replace(/\n{3,}/g, "\n\n").trim();
}
