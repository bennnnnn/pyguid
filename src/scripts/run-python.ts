import csvShim from "../skulpt-shims/csv.py?raw";
import ioShim from "../skulpt-shims/io.py?raw";

const SKULPT_TIMEOUT_MS = 8000;
const SKULPT_CDN = "https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist";
const IO_MODULE_PATH = "src/lib/io.py";
const CSV_MODULE_PATH = "src/lib/csv.py";

let skulptReady: Promise<void> | null = null;
let shimsRegistered = false;

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
    registerSkulptShims((window as unknown as SkulptWindow).Sk);
    return Promise.resolve();
  }

  if (!skulptReady) {
    skulptReady = loadScript(`${SKULPT_CDN}/skulpt.min.js`)
      .then(() => loadScript(`${SKULPT_CDN}/skulpt-stdlib.js`))
      .then(() => {
        registerSkulptShims((window as unknown as SkulptWindow).Sk);
      });
  }

  return skulptReady;
}

function registerSkulptShims(Sk: SkulptWindow["Sk"]) {
  if (shimsRegistered || !Sk.builtinFiles?.files) return;
  Sk.builtinFiles.files[IO_MODULE_PATH] = ioShim;
  Sk.builtinFiles.files[CSV_MODULE_PATH] = csvShim;
  shimsRegistered = true;
}

function clearSkulptModuleCache(Sk: SkulptWindow["Sk"], moduleName: string) {
  const modules = (Sk as { sysmodules?: Record<string, unknown> }).sysmodules;
  if (!modules) return;
  for (const key of Object.keys(modules)) {
    if (key === moduleName || key.endsWith(`$${moduleName}`)) {
      delete modules[key];
    }
  }
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

function usesMatchCase(code: string): boolean {
  return /^\s*match\s+\S/m.test(code) || /\n\s*match\s+\S/m.test(code);
}

export async function runPython(code: string): Promise<string> {
  if (usesMatchCase(code)) {
    return (
      "Error: match/case needs Python 3.10+. The in-browser runner does not support it yet. " +
      "Copy the code and run it locally with python (3.10 or newer)."
    );
  }

  await withTimeout(
    loadSkulpt(),
    15000,
    "Could not load the Python runner. Check your connection or try again later.",
  );

  const { Sk } = window as unknown as SkulptWindow;
  registerSkulptShims(Sk);
  clearSkulptModuleCache(Sk, "io");
  clearSkulptModuleCache(Sk, "csv");
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
