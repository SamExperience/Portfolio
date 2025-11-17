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

  /**
   * Updated gallery structure:
   * supports images and video elements.
   */
  imgURL?: Array<{
    url: string; // image or video URL
    title: string;
    altText?: string;

    // NEW: identify if it's an image or a video
    type?: 'image' | 'video';

    // NEW: responsive images (optional)
    srcset?: {
      mobile?: string;
      tablet?: string;
      desktop?: string;
      large?: string;
      all?: string;
    };

    // NEW: video-specific fields (optional)
    poster?: string;
    captionsUrl?: string;
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
