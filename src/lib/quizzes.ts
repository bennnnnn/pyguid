import ch1 from "../data/quizzes/chapter-1.json";
import ch2 from "../data/quizzes/chapter-2.json";
import ch3 from "../data/quizzes/chapter-3.json";
import ch4 from "../data/quizzes/chapter-4.json";
import ch5 from "../data/quizzes/chapter-5.json";
import ch6 from "../data/quizzes/chapter-6.json";
import ch7 from "../data/quizzes/chapter-7.json";
import ch8 from "../data/quizzes/chapter-8.json";
import ch9 from "../data/quizzes/chapter-9.json";
import ch10 from "../data/quizzes/chapter-10.json";
import ch11 from "../data/quizzes/chapter-11.json";
import ch12 from "../data/quizzes/chapter-12.json";
import ch13 from "../data/quizzes/chapter-13.json";
import ch14 from "../data/quizzes/chapter-14.json";
import ch15 from "../data/quizzes/chapter-15.json";
import ch16 from "../data/quizzes/chapter-16.json";
import ch17 from "../data/quizzes/chapter-17.json";
import ch18 from "../data/quizzes/chapter-18.json";
import ch19 from "../data/quizzes/chapter-19.json";
import ch20 from "../data/quizzes/chapter-20.json";
import ch21 from "../data/quizzes/chapter-21.json";
import ch22 from "../data/quizzes/chapter-22.json";
import ch23 from "../data/quizzes/chapter-23.json";
import ch24 from "../data/quizzes/chapter-24.json";
import ch25 from "../data/quizzes/chapter-25.json";
import ch26 from "../data/quizzes/chapter-26.json";
import ch27 from "../data/quizzes/chapter-27.json";
import ch28 from "../data/quizzes/chapter-28.json";
import ch29 from "../data/quizzes/chapter-29.json";
import ch30 from "../data/quizzes/chapter-30.json";
import ch31 from "../data/quizzes/chapter-31.json";

export type ChoiceQuestion = {
  id: string;
  type: "choice";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  /** Lesson slug for /python/{slug}/ — shown in results review */
  lessonSlug?: string;
};

export type TrueFalseQuestion = {
  id: string;
  type: "truefalse";
  prompt: string;
  correct: boolean;
  explanation: string;
  lessonSlug?: string;
};

export type QuizQuestion = ChoiceQuestion | TrueFalseQuestion;

export type ChapterQuiz = {
  chapter: number;
  chapterTitle: string;
  title: string;
  description: string;
  passPercent: number;
  questions: QuizQuestion[];
};

const quizzes: ChapterQuiz[] = [
  ch1,
  ch2,
  ch3,
  ch4,
  ch5,
  ch6,
  ch7,
  ch8,
  ch9,
  ch10,
  ch11,
  ch12,
  ch13,
  ch14,
  ch15,
  ch16,
  ch17,
  ch18,
  ch19,
  ch20,
  ch21,
  ch22,
  ch23,
  ch24,
  ch25,
  ch26,
  ch27,
  ch28,
  ch29,
  ch30,
  ch31,
] as ChapterQuiz[];

export function getAllQuizzes(): ChapterQuiz[] {
  return quizzes.sort((a, b) => a.chapter - b.chapter);
}

export function getQuizByChapter(chapter: number): ChapterQuiz | undefined {
  return quizzes.find((q) => q.chapter === chapter);
}
