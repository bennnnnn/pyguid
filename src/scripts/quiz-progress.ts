import type { User } from "@supabase/supabase-js";
import {
  formatQuizScoreBadge,
  readLocalQuizResult,
  writeLocalQuizResult,
  type QuizResultRecord,
} from "../lib/quiz-progress";
import { getSupabaseClient, isAuthConfigured } from "../lib/supabase/client";

type DbQuizRow = {
  quiz_slug: string;
  score_pct: number;
  correct: number;
  total: number;
  passed: boolean;
  completed_at: string;
};

function rowToRecord(row: DbQuizRow): QuizResultRecord {
  return {
    quizSlug: row.quiz_slug,
    scorePct: row.score_pct,
    correct: row.correct,
    total: row.total,
    passed: row.passed,
    completedAt: row.completed_at,
  };
}

function mergeResults(
  a: QuizResultRecord | undefined,
  b: QuizResultRecord | undefined,
): QuizResultRecord | undefined {
  if (!a) return b;
  if (!b) return a;
  const best = a.scorePct >= b.scorePct ? a : b;
  return {
    ...best,
    passed: a.passed || b.passed,
  };
}

export async function fetchCloudQuizResults(userId: string): Promise<Map<string, QuizResultRecord>> {
  const map = new Map<string, QuizResultRecord>();
  if (!isAuthConfigured()) return map;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("quiz_results")
    .select("quiz_slug, score_pct, correct, total, passed, completed_at")
    .eq("user_id", userId);

  if (error || !data) return map;
  for (const row of data as DbQuizRow[]) {
    map.set(row.quiz_slug, rowToRecord(row));
  }
  return map;
}

async function upsertCloudQuizResult(userId: string, result: QuizResultRecord): Promise<void> {
  if (!isAuthConfigured()) return;

  const supabase = getSupabaseClient();
  const { data: existing } = await supabase
    .from("quiz_results")
    .select("score_pct, correct, total, passed")
    .eq("user_id", userId)
    .eq("quiz_slug", result.quizSlug)
    .maybeSingle();

  const prev = existing as Pick<DbQuizRow, "score_pct" | "correct" | "total" | "passed"> | null;
  const scorePct = Math.max(prev?.score_pct ?? 0, result.scorePct);
  const passed = (prev?.passed ?? false) || result.passed;
  const correct =
    result.scorePct >= (prev?.score_pct ?? -1) ? result.correct : (prev?.correct ?? result.correct);

  await supabase.from("quiz_results").upsert(
    {
      user_id: userId,
      quiz_slug: result.quizSlug,
      score_pct: scorePct,
      correct,
      total: result.total,
      passed,
      completed_at: result.completedAt,
    },
    { onConflict: "user_id,quiz_slug" },
  );
}

export async function saveQuizResult(
  result: Omit<QuizResultRecord, "completedAt">,
  chapter?: number,
): Promise<void> {
  const record: QuizResultRecord = {
    ...result,
    completedAt: new Date().toISOString(),
  };

  writeLocalQuizResult(result.quizSlug, result);

  if (!isAuthConfigured()) return;
  const supabase = getSupabaseClient();
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user?.id;
  if (!userId) return;

  await upsertCloudQuizResult(userId, record);

  if (chapter != null) {
    try {
      localStorage.removeItem(`pyguide-quiz-ch${chapter}`);
    } catch {
      /* ignore */
    }
  }

  paintQuizHubBadges();
}

async function buildResultsMap(user: User | null): Promise<Map<string, QuizResultRecord>> {
  const map = new Map<string, QuizResultRecord>();

  document.querySelectorAll<HTMLElement>("[data-quiz-slug]").forEach((el) => {
    const slug = el.dataset.quizSlug;
    if (!slug) return;
    const chapter = el.dataset.quizChapter ? Number(el.dataset.quizChapter) : undefined;
    const passPercent = el.dataset.quizPass ? Number(el.dataset.quizPass) : 70;
    const local = readLocalQuizResult(slug, chapter, passPercent);
    if (local) map.set(slug, local);
  });

  if (user) {
    const cloud = await fetchCloudQuizResults(user.id);
    for (const [slug, record] of cloud) {
      map.set(slug, mergeResults(map.get(slug), record)!);
    }
  }

  return map;
}

export function paintQuizHubBadges(results?: Map<string, QuizResultRecord>): void {
  const root = document.getElementById("quiz-hub-root");
  if (!root) return;

  root.querySelectorAll<HTMLElement>("[data-quiz-slug]").forEach((card) => {
    const slug = card.dataset.quizSlug;
    const badge = card.querySelector<HTMLElement>("[data-quiz-badge]");
    if (!slug || !badge) return;

    const result = results?.get(slug);
    if (!result) {
      badge.classList.add("hidden");
      badge.textContent = "";
      return;
    }

    badge.textContent = formatQuizScoreBadge(result);
    badge.classList.remove("hidden");
    badge.classList.toggle("quiz-badge-passed", result.passed);
    badge.classList.toggle("quiz-badge-attempt", !result.passed);
  });
}

export async function refreshQuizHub(user: User | null): Promise<void> {
  if (!document.getElementById("quiz-hub-root")) return;
  const results = await buildResultsMap(user);
  paintQuizHubBadges(results);
}

export async function syncLocalQuizResultsToCloud(user: User): Promise<void> {
  if (!isAuthConfigured()) return;

  const slugs = new Set<string>();
  document.querySelectorAll<HTMLElement>("[data-quiz-slug]").forEach((el) => {
    if (el.dataset.quizSlug) slugs.add(el.dataset.quizSlug);
  });

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("pyguide-quiz-")) continue;
      const slug = key.replace("pyguide-quiz-", "");
      if (slug.startsWith("ch")) continue;
      slugs.add(slug);
    }
  } catch {
    /* ignore */
  }

  for (const slug of slugs) {
    const local = readLocalQuizResult(slug);
    if (!local) continue;
    await upsertCloudQuizResult(user.id, local);
  }
}

export async function initQuizProgress(): Promise<void> {
  let user: User | null = null;
  if (isAuthConfigured()) {
    const supabase = getSupabaseClient();
    const { data } = await supabase.auth.getSession();
    user = data.session?.user ?? null;
  }
  await refreshQuizHub(user);
}
