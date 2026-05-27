import { Project, Blog, Journal, ProjectSettings } from "./types";

export const DEFAULT_SETTINGS: ProjectSettings = {
  githubUsername: "eshaankalyan", // Default placeholder that displays instructions but can be replaced dynamically
  profileName: "Eshaan Kalyan Kumar",
  profileRole: "Creative Technologist & Interface Designer",
  profileBio: "Focusing on elegant digital environments, fast-loading engineering, and humble tools. I believe code should empower visitors to solve their tasks quickly, then get back to the physical world.",
  email: "eshaankalyankumar@gmail.com",
  linkedin: "https://linkedin.com/in/eshaankalyan",
  twitter: "https://twitter.com/eshaankalyan",
  github: "https://github.com/eshaankalyan"
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "aura-editor",
    title: "Aura Zen Editor",
    description: "A distraction-free typography canvas designed for pure writing focus. Combines generative ambient rain loops with a seamless offline markdown previewer.",
    date: "2026-03",
    tags: ["React", "TypeScript", "Tailwind", "WebAudio"],
    link: "https://aura-zen-editor.vercel.app",
    role: "Solo Creator",
    codeLanguage: "TypeScript",
    isFeatured: true,
    content: "Designed to solve a personal frustration: modern writing software is either too heavy or hides your work behind premium walls. Aura features local storage caching, a bespoke minimalist typewriter sound engine, and full export to PDF, HTML, or raw markdown.\n\nEvery button and panel fades out as soon as you start typing, leaving you entirely alone with your thoughts and the typography."
  },
  {
    id: "lumen-grid",
    title: "Lumen Grid Orchestrator",
    description: "An open-source layout framework built for fluid, typography-first publishing grids and fluid-font alignments.",
    date: "2026-01",
    tags: ["CSS Grid", "Tailwind v4", "Typefaces"],
    githubUrl: "https://github.com/eshaankalyan/lumen-grid",
    role: "Arch Designer",
    codeLanguage: "CSS",
    isFeatured: true,
    content: "Lumen Grid provides automatic rhythmic mathematical grids based on fractional Golden Ratio points. Great for artists, typographers, and digital authors looking for the editorial aesthetic of printed media without performance degradation."
  },
  {
    id: "vapor-container",
    title: "Vapor Cache Stack",
    description: "An ultra-lean HTTP caching middleware layer designed specifically for high-frequency low-spec container servers.",
    date: "2025-11",
    tags: ["Rust", "WASM", "Edge Compute"],
    role: "Lead Engineer",
    codeLanguage: "Rust",
    isFeatured: false,
    content: "Developed to facilitate high-throughput REST calls on edge nodes. Drops memory footprints to under 4MB while improving database query hit rates by 340% on standard workloads."
  }
];

export const DEFAULT_BLOGS: Blog[] = [
  {
    id: "respect-for-attention",
    title: "Minimalism is not a style—it is respect",
    date: "May 24, 2026",
    readTime: "4 min read",
    previewText: "In a world designed to steal your attention, offering a clean, empty canvas is a profound act of care and respect.",
    category: "Perspective",
    content: "Every pixel, pop-up, and layout element on the modern web is fighting a silent war for your gaze. Standard corporate websites are cluttered with cookie banners, newsletter overlays, scrolling telemetry chips, and intrusive dynamic grids designed by retention committees.\n\nWhen we look at editorial masterworks like **Alan Menken**, **Collins**, or **Shiyun Lu**, we find a reassuring silence. The design relies on breathing room—generous padding, high contrast serif headings, and a layout that doesn't scream 'Look at me!'\n\nDesigning with visual restraint is not about 'having less style.' It is about establishing clear semantic hierarchy. You speak with high-fidelity typography, use borders with extreme subtlety, and allow users to gather knowledge and close the tab without feeling mentally drained."
  },
  {
    id: "tools-not-toys",
    title: "Building humble software that gets out of the way",
    date: "April 12, 2026",
    readTime: "3 min read",
    previewText: "Why we must move away from retention optimization and focus purely on creating high-utility tools.",
    category: "Philosophy",
    content: "When software is evaluated purely by 'Time on Site', developers are incentivized to engineer friction. We add complex notifications, gamified leveling, and simulated status logs to keep people staring at the glass.\n\nBut a tool's success should be measured inversely: how quickly did the user complete their task and return back to the physical world? A great calculator shouldn't have social sharing. A portfolio shouldn't be a maze. It should state your work clearly, give visitors a frictionless route to connect, and respect their time."
  }
];

export const DEFAULT_JOURNAL_ENTRIES: Journal[] = [
  {
    id: "journal-01",
    date: "May 27, 2026",
    time: "18:42",
    location: "Studio Desk",
    content: "Spent the afternoon examining early 90s display brochures. Bold sans-serif captions paired with light, sprawling serif paragraphs can elevate simple list items into artwork. Kept thinking about how to bring that printed feel to dynamic code grids. There's so much digital noise we can afford to mute.",
    mood: "Reflective"
  },
  {
    id: "journal-02",
    date: "May 14, 2026",
    time: "21:15",
    location: "Cafe Corner",
    content: "Tested fetching raw repositories via the GitHub REST API entirely in-client. It works beautifully! It gives a live, changing signature of a developer's real-time hobbies without requiring complex cron jobs, lambda servers, or databases. Authentic, dynamic, and extremely simple to maintain.",
    mood: "Excited"
  },
  {
    id: "journal-03",
    date: "May 02, 2026",
    time: "09:30",
    location: "Home Platform",
    content: "A friend asked why my site doesn't have an AI chatbot that answers questions for employers. I told him: direct human communication is rare and beautiful. Let them read my short raw updates. If they want to speak, they can write me an email directly. Simplicity creates real connection.",
    mood: "Calm"
  }
];
