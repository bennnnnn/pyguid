export type FastapiRoadmapLesson = {
  id: string;
  title: string;
};

export type FastapiRoadmapSection = {
  id: string;
  title: string;
  lessons: FastapiRoadmapLesson[];
  /** Optional illustrative snippet for the roadmap index card */
  example?: string;
};

export type FastapiRoadmapMeta = {
  title: string;
  subtitle: string;
  description: string;
};
