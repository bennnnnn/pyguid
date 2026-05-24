import { SITE } from "./site";

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export function breadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function websiteJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: `${siteUrl}/`,
    description: SITE.description,
    inLanguage: "en",
    publisher: organizationJsonLd(siteUrl),
  };
}

export function organizationJsonLd(siteUrl: string) {
  return {
    "@type": "Organization",
    name: SITE.name,
    url: siteUrl,
  };
}

export function techArticleJsonLd(opts: {
  siteUrl: string;
  url: string;
  headline: string;
  description: string;
  articleBody?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: opts.headline,
    description: opts.description,
    url: opts.url,
    inLanguage: "en",
    author: {
      "@type": "Organization",
      name: SITE.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: opts.siteUrl,
    },
    ...(opts.articleBody ? { articleBody: opts.articleBody } : {}),
  };
}

export function quizLearningResourceJsonLd(opts: {
  siteUrl: string;
  url: string;
  name: string;
  description: string;
  chapterTitle: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    learningResourceType: "Quiz",
    inLanguage: "en",
    isPartOf: {
      "@type": "Course",
      name: `PyGuide — ${opts.chapterTitle}`,
      provider: {
        "@type": "Organization",
        name: SITE.name,
        url: opts.siteUrl,
      },
    },
  };
}

export function pythonChapterUrl(siteUrl: string, chapterTitle: string): string {
  const anchor = chapterTitle
    .toLowerCase()
    .replace(/\(\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${siteUrl}/python/#${anchor || "topic"}`;
}

export function lessonLearningResourceJsonLd(opts: {
  siteUrl: string;
  url: string;
  title: string;
  description: string;
  chapterTitle: string;
  level?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: opts.title,
    description: opts.description,
    url: opts.url,
    learningResourceType: "Lesson",
    educationalLevel: opts.level ?? "beginner",
    inLanguage: "en",
    isPartOf: {
      "@type": "Course",
      name: `PyGuide — ${opts.chapterTitle}`,
      provider: {
        "@type": "Organization",
        name: SITE.name,
        url: opts.siteUrl,
      },
    },
  };
}
