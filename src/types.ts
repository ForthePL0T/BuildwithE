export interface Project {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  link?: string;
  githubUrl?: string;
  role?: string;
  codeLanguage?: string;
  isFeatured?: boolean;
  content?: string;
}

export interface Blog {
  id: string;
  title: string;
  date: string;
  readTime: string;
  previewText: string;
  content: string; // supports Markdown formatting
  category: string;
}

export interface Journal {
  id: string;
  date: string;
  time?: string;
  location?: string;
  content: string;
  mood?: string;
}

export interface ProjectSettings {
  githubUsername: string;
  profileName: string;
  profileRole: string;
  profileBio: string;
  email: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
}
