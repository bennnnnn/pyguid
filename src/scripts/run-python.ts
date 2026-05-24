const SKULPT_TIMEOUT_MS = 8000;
const SKULPT_CDN = "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist";

let skulptReady: Promise<void> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if ((existing as HTMLScriptElement).dataset.loaded === "true") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error(`Failed to load ${src}`)),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export function loadSkulpt(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Skulpt runs only in the browser"));
  }

  if ((window as unknown as { Sk?: unknown }).Sk) {
    return Promise.resolve();
  }

  if (!skulptReady) {
    skulptReady = loadScript(`${SKULPT_CDN}/skulpt.min.js`).then(() =>
      loadScript(`${SKULPT_CDN}/skulpt-stdlib.js`),
    );
  }

  return skulptReady;
}

type SkulptWindow = {
  Sk: {
    configure: (opts: Record<string, unknown>) => void;
    builtinFiles: { files: Record<string, string> };
    importMainWithBody: (name: string, canSuspend: boolean, body: string) => unknown;
    misceval: { asyncToPromise: (fn: () => unknown) => Promise<unknown> };
  };
};

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function runPython(code: string): Promise<string> {
  await withTimeout(
    loadSkulpt(),
    15000,
    "Could not load the Python runner. Check your connection or try again later.",
  );

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
    await withTimeout(
      Sk.misceval.asyncToPromise(() =>
        Sk.importMainWithBody("<stdin>", false, code, true),
      ),
      SKULPT_TIMEOUT_MS,
      "Your code took too long (possible infinite loop). Stop and fix the loop, then run again.",
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return `Error: ${msg}`;
  }

  return lines.join("").replace(/\n$/, "");
}
