export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  projectTags: string[];

  // optional / additional metadata
  heroImage?: string;
  category?: string;
  role?: string;
  duration?: string;
  year?: number;
  teamSize?: string;
  liveUrl?: string;
  githubUrl?: string;

  // content
  description?: string;
  problemStatement?: string;
  objectif?: string[];

  // features / challenges / decisions
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  challenges?: Array<{
    problem: string;
    solution: string;
  }>;

  developmentProcess?: Array<{
    phase: string;
    description: string;
    duration?: string;
  }>;

  technicalDecisions?: Array<{
    question: string;
    answer: string;
  }>;

  techUsed?: Array<{ title: string; names: string[] }>;

  imgURL?: Array<{
    url: string;
    title: string;
    altText?: string;
  }>;

  metrics?: Array<{
    value: string;
    label: string;
  }>;

  results?: string;
  whatLearned?: string[];
  accessibility?: string[];
  futureImprovements?: string[];

  personalData?: {
    urlImg?: string;
    name?: string;
    role?: string;
  };
}
