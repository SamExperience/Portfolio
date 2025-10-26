export interface Project {
  id: number;
  title: string;
  shortDescription: string;
  projectTags: [string];
  description: string;
  objectif: [string];
  techUsed?: [{ title: string; names: [string] }];
  imgURL?: [{ url: string; title: string }];
  results?: string;
  whatLearned?: [string];
}
