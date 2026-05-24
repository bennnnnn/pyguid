export type AiTerminologyFaqItem = {
  question: string;
  answer: string;
};

export const AI_TERMINOLOGY_FAQ: AiTerminologyFaqItem[] = [
  {
    question: "What is the PyGuide AI terminology glossary?",
    answer:
      "It is a separate reference of AI and machine learning vocabulary for Python developers. Each group covers one topic (LLMs, RAG, agents, MLOps, and more) with plain-language definitions.",
  },
  {
    question: "How should I use the study order?",
    answer:
      "Follow the numbered study order on the index page from AI Big Picture through MLOps. Open each group in the sidebar, read the terms, then move on when the ideas feel familiar.",
  },
  {
    question: "Do I need to know Python before reading these terms?",
    answer:
      "Basic Python helps because many notes mention libraries like pandas, scikit-learn, and PyTorch. You can still read definitions first and return to Python tutorials when you hit an unfamiliar library.",
  },
  {
    question: "What are the first 100 AI terms to learn?",
    answer:
      "The curated list on the index page highlights essential vocabulary across AI foundations, data, training, LLMs, RAG, agents, and deployment. Start there if you want a focused path instead of every term at once.",
  },
  {
    question: "How is this different from the Python tutorials?",
    answer:
      "Python tutorials teach the language step by step. This glossary explains AI/ML concepts and industry words you will see in docs, APIs, and job posts while building Python projects.",
  },
  {
    question: "Can I search by abbreviations like LLM or RAG?",
    answer:
      "Yes. Search matches term names, aliases (for example GPT for generative models), related terms, and definition text.",
  },
];
