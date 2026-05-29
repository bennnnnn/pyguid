export type QuizResultRecord = {
  quizSlug: string;
  scorePct: number;
  correct: number;
  total: number;
  passed: boolean;
  completedAt: string;
};

export function localQuizStorageKey(quizSlug: string): string {
  return `pyguide-quiz-${quizSlug}`;
}

/** Legacy key before slug-based storage. */
export function legacyQuizStorageKey(chapter: number): string {
  return `pyguide-quiz-ch${chapter}`;
}

export function readLocalQuizResult(
  quizSlug: string,
  chapter?: number,
  passPercent = 70,
): QuizResultRecord | null {
  if (typeof localStorage === "undefined") return null;

  const keys = [localQuizStorageKey(quizSlug)];
  if (chapter != null) keys.push(legacyQuizStorageKey(chapter));

  for (const key of keys) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const data = JSON.parse(raw) as {
        scorePct?: number;
        correct?: number;
        total?: number;
        passed?: boolean;
        at?: number;
      };
      if (typeof data.scorePct !== "number") continue;
      return {
        quizSlug,
        scorePct: data.scorePct,
        correct: data.correct ?? 0,
        total: data.total ?? 0,
        passed: data.passed ?? data.scorePct >= passPercent,
        completedAt: new Date(data.at ?? Date.now()).toISOString(),
      };
    } catch {
      /* ignore */
    }
  }
  return null;
}

export function writeLocalQuizResult(
  quizSlug: string,
  result: Omit<QuizResultRecord, "quizSlug" | "completedAt">,
): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(
      localQuizStorageKey(quizSlug),
      JSON.stringify({
        scorePct: result.scorePct,
        correct: result.correct,
        total: result.total,
        passed: result.passed,
        at: Date.now(),
      }),
    );
  } catch {
    /* ignore */
  }
}

export function formatQuizScoreBadge(result: QuizResultRecord): string {
  if (result.passed) return `Passed · ${result.scorePct}%`;
  return `Best · ${result.scorePct}%`;
}
