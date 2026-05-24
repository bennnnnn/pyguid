import type { ChapterQuiz, QuizQuestion } from "../lib/quizzes";

/** Quiz payload embedded in the page (subset of ChapterQuiz). */
export type ChapterQuizData = Pick<
  ChapterQuiz,
  "chapter" | "chapterTitle" | "title" | "passPercent" | "questions"
>;

type AnswerValue = number | boolean | null;

function getRoot(): HTMLElement | null {
  return document.getElementById("chapter-quiz-root");
}

function parseQuiz(root: HTMLElement): ChapterQuizData {
  const el = root.querySelector("#chapter-quiz-data");
  const raw = el?.textContent;
  if (!raw) throw new Error("Missing quiz data");
  return JSON.parse(raw) as ChapterQuizData;
}

function isAnswered(value: AnswerValue): boolean {
  return value !== null && value !== undefined;
}

function isCorrect(q: QuizQuestion, answer: AnswerValue): boolean {
  if (answer === null) return false;
  if (q.type === "choice") return answer === q.correctIndex;
  return answer === q.correct;
}

function formatAnswer(q: QuizQuestion, answer: AnswerValue): string {
  if (answer === null) return "(no answer)";
  if (q.type === "choice") return q.options[answer as number] ?? "(invalid)";
  return answer ? "True" : "False";
}

function formatCorrect(q: QuizQuestion): string {
  if (q.type === "choice") return q.options[q.correctIndex];
  return q.correct ? "True" : "False";
}

function tutorialLinkHtml(lessonSlug: string | undefined): string {
  if (!lessonSlug || !/^[a-z0-9-]+$/.test(lessonSlug)) return "";
  const href = `/python/${lessonSlug}/`;
  return `<p class="quiz-review-tutorial"><a href="${href}">Related tutorial</a></p>`;
}

export function initChapterQuiz() {
  const root = getRoot();
  if (!root) return;

  const quiz = parseQuiz(root);
  const answers: AnswerValue[] = quiz.questions.map(() => null);

  const formEl = root.querySelector<HTMLElement>("[data-exam-form]");
  const resultsEl = root.querySelector<HTMLElement>("[data-exam-results]");
  const progressFill = root.querySelector<HTMLElement>("[data-progress-fill]");
  const progressAnswered = root.querySelector<HTMLElement>("[data-progress-answered]");
  const submitBtn = root.querySelector<HTMLButtonElement>("[data-submit-exam]");
  const retryBtn = root.querySelector<HTMLButtonElement>("[data-retry-exam]");
  const scoreRing = root.querySelector<HTMLElement>("[data-score-ring]");
  const scoreValue = root.querySelector<HTMLElement>("[data-score-value]");
  const resultsSummary = root.querySelector<HTMLElement>("[data-results-summary]");
  const resultsVerdict = root.querySelector<HTMLElement>("[data-results-verdict]");
  const reviewList = root.querySelector<HTMLElement>("[data-review-list]");

  function updateProgress() {
    const count = answers.filter((a) => isAnswered(a)).length;
    const pct = (count / quiz.questions.length) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressAnswered) {
      progressAnswered.textContent = `${count} of ${quiz.questions.length} answered`;
    }
  }

  root.querySelectorAll<HTMLElement>("[data-question-card]").forEach((card) => {
    const idx = Number(card.dataset.qIndex);
    const q = quiz.questions[idx];
    if (!q) return;

    const bindOption = (input: HTMLInputElement) => {
      input.addEventListener("change", () => {
        card.querySelectorAll(".quiz-option").forEach((label) => {
          const radio = label.querySelector('input[type="radio"]');
          label.classList.toggle("is-selected", radio === input && input.checked);
        });
        if (q.type === "choice") {
          answers[idx] = Number(input.value);
        } else {
          answers[idx] = input.value === "true";
        }
        card.classList.add("is-answered");
        card.classList.remove("is-unanswered-flash");
        updateProgress();
      });
    };

    card.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach(bindOption);
  });

  submitBtn?.addEventListener("click", () => {
    const unanswered = answers.findIndex((a) => !isAnswered(a));
    if (unanswered >= 0) {
      const card = root.querySelector(`[data-q-index="${unanswered}"]`);
      card?.classList.add("is-unanswered-flash");
      card?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (isCorrect(q, answers[i]!)) correct += 1;
    });

    const scorePct = Math.round((correct / quiz.questions.length) * 100);
    const passed = scorePct >= quiz.passPercent;

    if (scoreValue) scoreValue.textContent = `${scorePct}%`;
    if (scoreRing) scoreRing.style.setProperty("--score-pct", String(scorePct));
    if (resultsVerdict) {
      resultsVerdict.textContent = passed ? "You passed!" : "Keep studying — try again";
      resultsVerdict.className = passed ? "quiz-results-pass" : "quiz-results-fail";
    }
    if (resultsSummary) {
      resultsSummary.textContent = `You got ${correct} out of ${quiz.questions.length} correct.`;
    }

    if (reviewList) {
      reviewList.innerHTML = "";
      quiz.questions.forEach((q, i) => {
        const ok = isCorrect(q, answers[i]!);
        const item = document.createElement("div");
        item.className = `quiz-review-item ${ok ? "is-correct" : "is-wrong"}`;
        item.innerHTML = `
          <p class="quiz-review-q">Q${i + 1}. ${escapeHtml(q.prompt)}</p>
          <p class="quiz-review-your"><strong>Your answer:</strong> ${escapeHtml(formatAnswer(q, answers[i]!))}</p>
          ${
            ok
              ? ""
              : `<p class="quiz-review-your"><strong>Correct:</strong> ${escapeHtml(formatCorrect(q))}</p>`
          }
          <p class="quiz-review-exp">${escapeHtml(q.explanation)}</p>
          ${tutorialLinkHtml(q.lessonSlug)}
        `;
        reviewList.appendChild(item);
      });
    }

    formEl?.classList.add("quiz-hidden");
    resultsEl?.classList.remove("quiz-hidden");
    resultsEl?.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      localStorage.setItem(
        `pyguide-quiz-ch${quiz.chapter}`,
        JSON.stringify({
          scorePct,
          correct,
          total: quiz.questions.length,
          at: Date.now(),
        }),
      );
    } catch {
      /* ignore */
    }
  });

  retryBtn?.addEventListener("click", () => {
    answers.fill(null);
    root.querySelectorAll("[data-question-card]").forEach((card) => {
      card.classList.remove("is-answered", "is-unanswered-flash");
      card.querySelectorAll<HTMLInputElement>("input[type=radio]").forEach((i) => {
        i.checked = false;
      });
    });
    updateProgress();
    resultsEl?.classList.add("quiz-hidden");
    formEl?.classList.remove("quiz-hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  updateProgress();
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
