export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  projectTags: string[];

  // 🆕 AGGIUNGI QUESTI
  heroImage: string; // Immagine principale grande
  category: string; // "Web Development", "Mobile App"
  role: string; // "Full-stack Developer"
  duration: string; // "3 months"
  year: number; // 2024
  teamSize: string; // "Solo" o "5 people"
  liveUrl?: string; // Link progetto live
  githubUrl?: string; // Link GitHub
  caseStudyUrl?: string; // Link caso studio

  // Esistenti migliorati
  description: string;
  objectif: string[];

  // 🆕 Features con icone
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;

  // 🆕 Challenges & Solutions
  challenges?: Array<{
    problem: string;
    solution: string;
  }>;

  techUsed?: Array<{ title: string; names: string[] }>;
  imgURL?: Array<{ url: string; title: string }>;

  // 🆕 Metrics
  metrics?: Array<{
    value: string;
    label: string;
  }>;

  results?: string;
  whatLearned?: string[];
  personalData?: {
    urlImg: string;
    name: string;
    role: string;
  };
}
