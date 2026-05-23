function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function highlightPythonLine(line: string): string {
  const trimmed = line.trim();
  if (trimmed.startsWith("#")) {
    return `<span class="text-[#5c6370] italic">${escapeHtml(line)}</span>`;
  }
  let html = escapeHtml(line);
  html = html.replace(
    /\b(print|len|type|True|False|not)\b/g,
    '<span class="text-[#61afef]">$1</span>',
  );
  html = html.replace(
    /("([^"\\]|\\.)*"|'([^'\\]|\\.)*')/g,
    '<span class="text-[#98c379]">$1</span>',
  );
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-[#d19a66]">$1</span>');
  return html;
}
