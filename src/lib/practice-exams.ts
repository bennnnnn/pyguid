import ch1 from "../data/practice-exams/chapter-1.json";
import ch2 from "../data/practice-exams/chapter-2.json";
import ch3 from "../data/practice-exams/chapter-3.json";
import ch5 from "../data/practice-exams/chapter-5.json";
import ch6 from "../data/practice-exams/chapter-6.json";
import ch7 from "../data/practice-exams/chapter-7.json";
import ch8 from "../data/practice-exams/chapter-8.json";
import ch9 from "../data/practice-exams/chapter-9.json";
import ch10 from "../data/practice-exams/chapter-10.json";
import ch11 from "../data/practice-exams/chapter-11.json";
import ch12 from "../data/practice-exams/chapter-12.json";
import ch13 from "../data/practice-exams/chapter-13.json";
import ch14 from "../data/practice-exams/chapter-14.json";
import ch15 from "../data/practice-exams/chapter-15.json";
import ch16 from "../data/practice-exams/chapter-16.json";
import ch17 from "../data/practice-exams/chapter-17.json";
import ch18 from "../data/practice-exams/chapter-18.json";
import ch19 from "../data/practice-exams/chapter-19.json";
import ch20 from "../data/practice-exams/chapter-20.json";
import ch21 from "../data/practice-exams/chapter-21.json";
import ch22 from "../data/practice-exams/chapter-22.json";
import ch23 from "../data/practice-exams/chapter-23.json";
import ch24 from "../data/practice-exams/chapter-24.json";
import ch25 from "../data/practice-exams/chapter-25.json";
import ch26 from "../data/practice-exams/chapter-26.json";
import ch27 from "../data/practice-exams/chapter-27.json";
import ch28 from "../data/practice-exams/chapter-28.json";
import ch29 from "../data/practice-exams/chapter-29.json";
import ch30 from "../data/practice-exams/chapter-30.json";
import ch31 from "../data/practice-exams/chapter-31.json";

export type ChoiceQuestion = {
  id: string;
  type: "choice";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type TrueFalseQuestion = {
  id: string;
  type: "truefalse";
  prompt: string;
  correct: boolean;
  explanation: string;
};

export type PracticeQuestion = ChoiceQuestion | TrueFalseQuestion;

export type PracticeExam = {
  chapter: number;
  chapterTitle: string;
  title: string;
  description: string;
  passPercent: number;
  questions: PracticeQuestion[];
};

const exams: PracticeExam[] = [
  ch1,
  ch2,
  ch3,
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
] as PracticeExam[];

export function getAllPracticeExams(): PracticeExam[] {
  return exams.sort((a, b) => a.chapter - b.chapter);
}

export function getPracticeExam(chapter: number): PracticeExam | undefined {
  return exams.find((e) => e.chapter === chapter);
}

/** @deprecated Use quizUrl() from quiz-topics.ts */
export function practiceExamUrl(chapter: number): string {
  return `/python/practice/${chapter}/`;
}
