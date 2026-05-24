import { runPython } from "./run-python";

let initialized = false;

function getExampleCode(root: Element | null | undefined): string {
  const source = root?.querySelector(".py-source");
  if (source instanceof HTMLTextAreaElement) {
    return source.value;
  }
  return "";
}

export function initPythonExamples() {
  if (initialized) return;
  initialized = true;

  // Skulpt loads on first Run click only (keeps non-lesson pages lighter)

  document.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    const copyBtn = target.closest(".py-copy") as HTMLButtonElement | null;
    const runBtn = target.closest(".py-run") as HTMLButtonElement | null;

    if (copyBtn) {
      const root = copyBtn.closest(".python-example");
      const code = getExampleCode(root);
      await navigator.clipboard.writeText(code);
      const prev = copyBtn.textContent;
      copyBtn.textContent = "Copied";
      setTimeout(() => {
        copyBtn.textContent = prev;
      }, 1200);
      return;
    }

    if (!runBtn) return;

    const root = runBtn.closest(".python-example");
    const output = root?.querySelector(".py-output") as HTMLElement | null;
    const code = getExampleCode(root);
    if (!output) return;

    runBtn.disabled = true;
    const prevLabel = runBtn.textContent;
    runBtn.textContent = "Loading…";
    output.textContent = "Loading Python runner…";
    output.classList.remove("py-output--error");

    try {
      runBtn.textContent = "Running…";
      output.textContent = "";
      const result = await runPython(code);
      output.textContent = result || "(no output)";
      if (result.startsWith("Error:")) output.classList.add("py-output--error");
    } catch (err) {
      output.textContent = `Error: ${err instanceof Error ? err.message : String(err)}`;
      output.classList.add("py-output--error");
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = prevLabel ?? "Run code";
    }
  });
}
