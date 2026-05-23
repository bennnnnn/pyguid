let skulptReady: Promise<void> | null = null;

function loadSkulpt(): Promise<void> {
  if (skulptReady) return skulptReady;

  skulptReady = new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as unknown as { Sk?: unknown }).Sk) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js";
    script.async = true;
    script.onload = () => {
      const stdlib = document.createElement("script");
      stdlib.src =
        "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js";
      stdlib.async = true;
      stdlib.onload = () => resolve();
      stdlib.onerror = () => reject(new Error("Failed to load Skulpt stdlib"));
      document.head.appendChild(stdlib);
    };
    script.onerror = () => reject(new Error("Failed to load Skulpt"));
    document.head.appendChild(script);
  });

  return skulptReady;
}

type SkulptWindow = {
  Sk: {
    configure: (opts: Record<string, unknown>) => void;
    builtinFiles: { files: Record<string, string> };
    importMainWithBody: (
      name: string,
      canSuspend: boolean,
      body: string,
    ) => unknown;
    misceval: { asyncToPromise: (fn: () => unknown) => Promise<unknown> };
  };
};

export async function runPython(code: string): Promise<string> {
  await loadSkulpt();
  const { Sk } = window as unknown as SkulptWindow;
  const lines: string[] = [];

  Sk.configure({
    output: (text: string) => {
      if (text) lines.push(text);
    },
    read: (file: string) => {
      if (Sk.builtinFiles?.files[file] === undefined) {
        throw new Error(`File not found: ${file}`);
      }
      return Sk.builtinFiles.files[file];
    },
  });

  try {
    await Sk.misceval.asyncToPromise(() =>
      Sk.importMainWithBody("<stdin>", false, code, true),
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return `Error: ${msg}`;
  }

  return lines.join("").replace(/\n$/, "");
}
