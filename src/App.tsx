/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Github, Linkedin, Twitter, Mail, Copy, Check, ChevronDown, 
  MapPin, Clock, Sliders, MessageSquare, Send, Calendar, Sparkles, ExternalLink
} from "lucide-react";

import { Project, Blog, Journal, ProjectSettings } from "./types";
import { 
  DEFAULT_SETTINGS, DEFAULT_PROJECTS, DEFAULT_BLOGS, DEFAULT_JOURNAL_ENTRIES 
} from "./data";
import DynamicGitHubRepos from "./components/DynamicGitHubRepos";
import CreatorPanel from "./components/CreatorPanel";

interface VisitorMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  messageText: string;
  timestamp: string;
}

export default function App() {
  // Page Active Tab State
  const [activeTab, setActiveTab] = useState<"home" | "projects" | "blogs" | "journal" | "contact">("home");
  
  // Custom Portfolio Data Core State (persisted via LocalStorage)
  const [settings, setSettings] = useState<ProjectSettings>(DEFAULT_SETTINGS);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [blogs, setBlogs] = useState<Blog[]>(DEFAULT_BLOGS);
  const [journals, setJournals] = useState<Journal[]>(DEFAULT_JOURNAL_ENTRIES);
  const [visitorMessages, setVisitorMessages] = useState<VisitorMessage[]>([]);

  // Interactive local states
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [expandedBlogId, setExpandedBlogId] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState<boolean>(false);
  
  // running clock state
  const [currentTime, setCurrentTime] = useState<string>("");

  // Contact form submission state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSuccess, setContactSuccess] = useState(false);

  // Load and apply local data on startup
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("portfolio_settings");
      const storedProjects = localStorage.getItem("portfolio_projects");
      const storedBlogs = localStorage.getItem("portfolio_blogs");
      const storedJournals = localStorage.getItem("portfolio_journals");
      const storedMessages = localStorage.getItem("portfolio_messages");

      if (storedSettings) setSettings(JSON.parse(storedSettings));
      if (storedProjects) setProjects(JSON.parse(storedProjects));
      if (storedBlogs) setBlogs(JSON.parse(storedBlogs));
      if (storedJournals) setJournals(JSON.parse(storedJournals));
      if (storedMessages) setVisitorMessages(JSON.parse(storedMessages));
    } catch (e) {
      console.error("Could not load local storage states", e);
    }
  }, []);

  // Update dynamic clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // State mutation functions (and sync with LocalStorage)
  const handleSaveSettings = (newSettings: ProjectSettings) => {
    setSettings(newSettings);
    localStorage.setItem("portfolio_settings", JSON.stringify(newSettings));
  };

  const handleSaveProject = (proj: Project) => {
    const exists = projects.some(p => p.id === proj.id);
    let updated: Project[];
    if (exists) {
      updated = projects.map(p => p.id === proj.id ? proj : p);
    } else {
      updated = [proj, ...projects];
    }
    setProjects(updated);
    localStorage.setItem("portfolio_projects", JSON.stringify(updated));
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem("portfolio_projects", JSON.stringify(updated));
    if (expandedProjectId === id) setExpandedProjectId(null);
  };

  const handleSaveBlog = (blog: Blog) => {
    const exists = blogs.some(b => b.id === blog.id);
    let updated: Blog[];
    if (exists) {
      updated = blogs.map(b => b.id === blog.id ? blog : b);
    } else {
      updated = [blog, ...blogs];
    }
    setBlogs(updated);
    localStorage.setItem("portfolio_blogs", JSON.stringify(updated));
  };

  const handleDeleteBlog = (id: string) => {
    const updated = blogs.filter(b => b.id !== id);
    setBlogs(updated);
    localStorage.setItem("portfolio_blogs", JSON.stringify(updated));
    if (expandedBlogId === id) setExpandedBlogId(null);
  };

  const handleSaveJournal = (journal: Journal) => {
    const exists = journals.some(j => j.id === journal.id);
    let updated: Journal[];
    if (exists) {
      updated = journals.map(j => j.id === journal.id ? journal : j);
    } else {
      updated = [journal, ...journals];
    }
    setJournals(updated);
    localStorage.setItem("portfolio_journals", JSON.stringify(updated));
  };

  const handleDeleteJournal = (id: string) => {
    const updated = journals.filter(j => j.id !== id);
    setJournals(updated);
    localStorage.setItem("portfolio_journals", JSON.stringify(updated));
  };

  const handleResetAll = () => {
    localStorage.removeItem("portfolio_settings");
    localStorage.removeItem("portfolio_projects");
    localStorage.removeItem("portfolio_blogs");
    localStorage.removeItem("portfolio_journals");
    localStorage.removeItem("portfolio_messages");

    setSettings(DEFAULT_SETTINGS);
    setProjects(DEFAULT_PROJECTS);
    setBlogs(DEFAULT_BLOGS);
    setJournals(DEFAULT_JOURNAL_ENTRIES);
    setVisitorMessages([]);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(settings.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Submit contact message simulation
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    const newMessage: VisitorMessage = {
      id: `msg-${Date.now()}`,
      senderName: contactName,
      senderEmail: contactEmail,
      messageText: contactMessage,
      timestamp: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updated = [newMessage, ...visitorMessages];
    setVisitorMessages(updated);
    localStorage.setItem("portfolio_messages", JSON.stringify(updated));

    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 4000);
  };

  const handleDeleteMessage = (id: string) => {
    const updated = visitorMessages.filter(m => m.id !== id);
    setVisitorMessages(updated);
    localStorage.setItem("portfolio_messages", JSON.stringify(updated));
  };

  return (
    <div id="app-root-frame" className="min-h-screen bg-[#fbfbf9] text-[#1c1b18] px-4 py-8 md:py-16 md:px-12 selection:bg-[#af7034] selection:text-white relative font-sans flex flex-col justify-between max-w-6xl mx-auto">
      
      {/* Dynamic Header & Interactive Navbar */}
      <header id="portfolio-main-header" className="border-b border-[#e8e6df] pb-6 mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight leading-none text-[#1c1b18] cursor-default hover:text-[#af7034] transition-colors flex items-center gap-2">
            {settings.profileName}
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" title="Available for collaborations"></span>
          </h1>
          <p className="font-mono text-2xs text-[#8c8a82] uppercase tracking-wider mt-2.5">
            {settings.profileRole}
          </p>
        </div>

        {/* Local time component */}
        <div className="flex flex-col items-start sm:items-end font-mono text-3xs text-[#8c8a82] gap-1">
          <div className="flex items-center gap-1.5 uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-[#a19f96]" />
            <span>Time: {currentTime || "17:35:00"} Local</span>
          </div>
          <div className="flex items-center gap-1.5 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-[#a19f96]" />
            <span>Earth Node System</span>
          </div>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <nav id="portfolio-main-nav" className="flex flex-wrap border-b border-[#e8e6df] mb-12 bg-[#fbfbf9] text-xs font-mono uppercase tracking-wider sticky top-0 py-2.5 z-40">
        {[
          { id: "home", label: "Index" },
          { id: "projects", label: "Projects" },
          { id: "blogs", label: "Perspective" },
          { id: "journal", label: "Journal" },
          { id: "contact", label: "Contact & Feed" },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => {
              setActiveTab(tab.id as any);
              setExpandedProjectId(null);
              setExpandedBlogId(null);
            }}
            className={`mr-6 py-2 transition-all relative select-none ${
              activeTab === tab.id
                ? "text-[#1c1b18] font-semibold"
                : "text-[#8c8a82] hover:text-[#1c1b18]"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="navIndicator"
                className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#af7034]"
                transition={{ duration: 0.25 }}
              />
            )}
          </button>
        ))}

        {/* Customize button right in navigation */}
        <button
          id="nav-customize-btn"
          onClick={() => setIsCreatorOpen(true)}
          className="ml-auto py-1 px-3.5 bg-[#f5f5f0] border border-[#e8e6df] text-3xs font-mono text-[#706e67] hover:border-[#1c1b18] hover:text-[#1c1b18] hover:bg-[#1c1b18] hover:text-white transition-all duration-300 flex items-center gap-1.5 align-middle select-none active:scale-[0.98]"
        >
          <Sliders className="w-3 h-3" /> Customize Portfolio
        </button>
      </nav>

      {/* Main Container Workspace */}
      <main id="tab-viewport-container" className="flex-grow min-h-[380px]">
        <AnimatePresence mode="wait">
          
          {/* HOME INDEX TAB */}
          {activeTab === "home" && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-16"
            >
              {/* Profile Intro Bio */}
              <section id="bio-presentation-section" className="max-w-3xl">
                <span className="font-mono text-xs uppercase tracking-wider text-[#8c8a82] block mb-3">
                  Introductory Note
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-light text-[#1c1b18] leading-tight tracking-tight">
                  {settings.profileBio}
                </h2>
              </section>

              {/* Featured Custom Projects */}
              <section id="featured-work-section" className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4">
                <div className="md:col-span-1 space-y-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-[#8c8a82] block">
                    Curated Action
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#1c1b18]">
                    Featured Explorations
                  </h3>
                  <p className="text-sm text-[#706e67] leading-relaxed pr-4">
                    Selected developments crafted with strict focus on typographic grid systems, computational efficiency, and digital hygiene.
                  </p>
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="text-xs font-mono font-medium text-[#af7034] hover:text-[#1c1b18] hover:underline"
                  >
                    Display all developments &rarr;
                  </button>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {projects.filter(p => p.isFeatured).slice(0, 2).map((proj) => (
                    <div
                      key={proj.id}
                      className="border border-[#e8e6df] p-6 bg-[#fbfbf9] group flex flex-col justify-between hover:border-[#a19f96] hover:bg-[#fcfcf9] transition-all duration-300"
                    >
                      <div>
                        <div className="flex justify-between items-baseline font-mono text-2xs text-[#8c8a82] mb-3">
                          <span>{proj.codeLanguage}</span>
                          <span>{proj.date}</span>
                        </div>
                        <h4 className="font-serif text-lg font-medium text-[#1c1b18] mb-2 group-hover:text-[#af7034] transition-colors">
                          {proj.title}
                        </h4>
                        <p className="text-xs text-[#706e67] leading-relaxed line-clamp-3 mb-4">
                          {proj.description}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setActiveTab("projects");
                          setExpandedProjectId(proj.id);
                        }}
                        className="text-xs font-mono font-medium text-[#1c1b18] group-hover:translate-x-1 transition-transform text-left inline-flex items-center gap-1 mt-auto"
                      >
                        Examine Case Study &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Dynamic perspective summary */}
              <section id="perspective-preview-section" className="grid grid-cols-1 md:grid-cols-2 gap-12 py-4 border-t border-[#e8e6df] pt-12">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#8c8a82] block mb-3">
                    Recent Perspectives
                  </span>
                  {blogs.slice(0, 1).map((blog) => (
                    <article key={blog.id} className="space-y-3">
                      <h4 className="font-serif text-xl font-medium text-[#1c1b18] hover:text-[#af7034] cursor-pointer transition-colors" onClick={() => { setActiveTab("blogs"); setExpandedBlogId(blog.id); }}>
                        {blog.title}
                      </h4>
                      <p className="text-xs text-[#706e67] leading-relaxed">
                        {blog.previewText}
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab("blogs");
                          setExpandedBlogId(blog.id);
                        }}
                        className="text-xs font-mono text-[#8c8a82] hover:text-[#1c1b18] block"
                      >
                        Read article in full ({blog.readTime}) &rarr;
                      </button>
                    </article>
                  ))}
                </div>

                {/* Micro journal notes */}
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#8c8a82] block mb-3">
                    Thought Journal Logs
                  </span>
                  <div className="space-y-4">
                    {journals.slice(0, 2).map((item) => (
                      <div key={item.id} className="border-l-2 border-[#e8e6df] pl-4 py-1 space-y-1.5 hover:border-[#af7034] transition-colors">
                        <div className="flex justify-between items-baseline font-mono text-3xs text-[#8c8a82]">
                          <span>{item.date}</span>
                          <span className="italic">{item.mood || "Focused"}</span>
                        </div>
                        <p className="text-xs text-[#706e67] line-clamp-2 leading-relaxed italic">
                          "{item.content}"
                        </p>
                      </div>
                    ))}
                    <button
                      onClick={() => setActiveTab("journal")}
                      className="text-xs font-mono text-[#af7034] hover:text-[#1c1b18] font-medium"
                    >
                      Flip through thought log stack &rarr;
                    </button>
                  </div>
                </div>
              </section>

              {/* Interactive Help statement block */}
              <section id="humble-commitment-section" className="bg-[#f5f5f0] p-8 border border-[#e8e6df] text-center max-w-2xl mx-auto space-y-3">
                <Sparkles className="w-5 h-5 mx-auto text-[#af7034]" />
                <h4 className="font-serif text-lg font-medium text-[#1c1b18]">Our Shared Platform Vision</h4>
                <p className="text-xs text-[#706e67] leading-relaxed">
                  "This design is dedicated strictly to sharing perspective, showcasing physical/digital output, and helping others. I refuse to turn this space into a machine for recruiter recruitment-telemetry or bloated resumes. If my philosophies resonate with you, let us collaborate on digital hygiene."
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setActiveTab("contact")}
                    className="font-mono text-xs underline text-[#1c1b18] hover:text-[#af7034] font-medium"
                  >
                    Transmit message or view live feedback board &rarr;
                  </button>
                </div>
              </section>
            </motion.div>
          )}

          {/* PROJECTS TAB (SHOWCASES PROJECTS IN GRID WITH ACCORDION BREAKDOWNS + GITHUB FEEDER) */}
          {activeTab === "projects" && (
            <motion.div
              key="projects-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-12"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#8c8a82] block mb-1">
                  Portfolio / Code Work
                </span>
                <h2 className="font-serif text-3xl font-light text-[#1c1b18]">
                  Curated Projects & Live Output
                </h2>
                <p className="text-sm text-[#706e67] mt-1.5">
                  Click on any development row to roll down custom design breakdowns, architecture challenges, and direct deployments.
                </p>
              </div>

              {/* Custom projects stack (dynamic list) */}
              <div id="custom-projects-stack" className="border-t border-[#e8e6df] divide-y divide-[#e8e6df]">
                {projects.map((proj) => {
                  const isExpanded = expandedProjectId === proj.id;
                  return (
                    <div key={proj.id} id={`project-item-${proj.id}`} className="py-6 group">
                      {/* Row Click Trigger */}
                      <div
                        onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none"
                      >
                        <div className="space-y-1 bg-transparent">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-3xs text-[#8c8a82] uppercase tracking-wider">
                              {proj.date}
                            </span>
                            {proj.isFeatured && (
                              <span className="px-1.5 py-0.2 bg-[#fdf2e9] text-[#b05d15] text-4xs font-mono uppercase border border-[#fddfc7]">
                                Featured Study
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif text-xl font-medium text-[#1c1b18] group-hover:text-[#af7034] transition-colors">
                            {proj.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                          <div className="flex gap-1.5">
                            {proj.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="font-mono text-3xs px-2 py-0.5 border border-[#e8e6df] text-[#706e67] bg-[#fbfbf9]">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <button
                            id={`proj-toggle-btn-${proj.id}`}
                            className="p-1 border border-[#e8e6df] text-[#706e67] hover:border-[#1c1b18] group-hover:bg-[#f5f5f0] transition-all"
                            aria-label="Toggle Details"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Expanding Case study box */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            id={`project-case-study-${proj.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6 pb-2 pl-2 pr-2 sm:pl-4 space-y-6">
                              <p className="text-sm text-[#1c1b18] font-serif leading-relaxed italic bg-[#fbfbf9] pr-4 border-l-2 border-[#af7034] pl-3 py-1">
                                {proj.description}
                              </p>

                              {/* Breakdown Grid stats */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border border-[#e8e6df] bg-[#faf9f5] font-mono text-2xs text-[#706e67]">
                                <div>
                                  <span className="block text-[#8c8a82] uppercase tracking-wider text-4xs">Role / Duty</span>
                                  <span className="font-medium text-[#1c1b18] mt-1 block">{proj.role || "Creator"}</span>
                                </div>
                                <div>
                                  <span className="block text-[#8c8a82] uppercase tracking-wider text-4xs">Engine Stack</span>
                                  <span className="font-medium text-[#1c1b18] mt-1 block">{proj.codeLanguage || "TypeScript"}</span>
                                </div>
                                <div>
                                  <span className="block text-[#8c8a82] uppercase tracking-wider text-4xs">Date Cycle</span>
                                  <span className="font-medium text-[#1c1b18] mt-1 block">{proj.date}</span>
                                </div>
                                <div>
                                  <span className="block text-[#8c8a82] uppercase tracking-wider text-4xs">Collaboration</span>
                                  <span className="font-medium text-[#1c1b18] mt-1 block">Help-First Open Source</span>
                                </div>
                              </div>

                              {/* Rich Details content */}
                              {proj.content && (
                                <div className="text-xs text-[#55534c] leading-relaxed font-sans space-y-3 whitespace-pre-wrap max-w-3xl">
                                  {proj.content}
                                </div>
                              )}

                              {/* Output Action buttons */}
                              <div className="flex gap-3 pt-2 font-mono text-xs">
                                {proj.link && (
                                  <a
                                    href={proj.link}
                                    target="_blank"
                                    rel="noreferrer referrer"
                                    className="px-4 py-2 bg-[#1c1b18] text-[#fbfbf9] hover:bg-[#af7034] transition-colors inline-flex items-center gap-1.5 select-none"
                                  >
                                    Inspect Live Site <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                {proj.githubUrl && (
                                  <a
                                    href={proj.githubUrl}
                                    target="_blank"
                                    rel="noreferrer referrer"
                                    className="px-4 py-2 border border-[#1c1b18] text-[#1c1b18] hover:bg-[#f5f5f0] transition-colors inline-flex items-center gap-1.5"
                                  >
                                    View Source Code <Github className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Live GitHub integration portion */}
              <DynamicGitHubRepos 
                username={settings.githubUsername} 
                onUsernameChange={(newUsername) => {
                  handleSaveSettings({ ...settings, githubUsername: newUsername });
                }}
              />
            </motion.div>
          )}

          {/* PERSPECTIVES BLOGS TAB (EXPANDABLE IN-PLACE) */}
          {activeTab === "blogs" && (
            <motion.div
              key="blogs-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-12"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#8c8a82] block mb-1">
                  Perspectives & Writing
                </span>
                <h2 className="font-serif text-3xl font-light text-[#1c1b18]">
                  Essays & Architectural Thoughts
                </h2>
                <p className="text-sm text-[#706e67] mt-1.5">
                  Deep arguments advocating for user attention, minimalist digital design, and honest interfaces.
                </p>
              </div>

              {/* Blogs listed stack */}
              <div id="blogs-index-stack" className="border-t border-[#e8e6df] divide-y divide-[#e8e6df]">
                {blogs.map((blog) => {
                  const isExpanded = expandedBlogId === blog.id;
                  return (
                    <article key={blog.id} id={`blog-post-${blog.id}`} className="py-8 group">
                      
                      {/* Row trigger structure */}
                      <div
                        onClick={() => setExpandedBlogId(isExpanded ? null : blog.id)}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4 cursor-pointer"
                      >
                        <div className="space-y-1 bg-transparent max-w-xl">
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-3xs uppercase text-[#8c8a82]">
                              {blog.category}
                            </span>
                            <span className="font-mono text-3xs text-[#8c8a82]">
                              {blog.date}
                            </span>
                          </div>
                          <h3 className="font-serif text-xl font-medium text-[#1c1b18] group-hover:text-[#af7034] transition-colors">
                            {blog.title}
                          </h3>
                          {!isExpanded && (
                            <p className="text-xs text-[#706e67] leading-relaxed line-clamp-1 italic mt-1 font-serif pr-4">
                              "{blog.previewText}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 font-mono text-xs text-[#8c8a82] w-full sm:w-auto justify-between sm:justify-start">
                          <span>{blog.readTime}</span>
                          <button
                            id={`blog-toggle-${blog.id}`}
                            className="p-1 border border-[#e8e6df] text-[#706e67] group-hover:border-[#1c1b18] group-hover:bg-[#f5f5f0] transition-all"
                            aria-label="Read Post"
                          >
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                        </div>
                      </div>

                      {/* Essay reader body */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            id={`blog-body-container-${blog.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-8 pt-6 border-t border-[#e8e6df]/60 pl-2 pr-2 sm:pl-6 max-w-2xl mx-auto space-y-6">
                              {/* Subtitle / Intro phrase */}
                              <blockquote className="font-serif italic text-base md:text-lg text-[#af7034] border-l-2 border-[#af7034] pl-4 py-1 leading-relaxed">
                                {blog.previewText}
                              </blockquote>

                              {/* Rendered markdown equivalents using nice spacing paragraphs */}
                              <div className="text-sm text-[#383631] font-serif leading-relaxed space-y-4 pt-2">
                                {blog.content.split("\n\n").map((para, idx) => {
                                  if (para.startsWith("#")) {
                                    // Handle custom heading rendering easily
                                    return (
                                      <h4 key={idx} className="font-serif text-lg font-semibold pt-4 text-[#1c1b18]">
                                        {para.replace(/^[#\s]+/, "")}
                                      </h4>
                                    );
                                  } else if (para.startsWith("-") || para.startsWith("*")) {
                                    // Handle bullet lists easily
                                    return (
                                      <ul key={idx} className="list-disc pl-5 font-sans text-xs space-y-2 py-2 text-[#706e67]">
                                        {para.split("\n").map((li, lIdx) => (
                                          <li key={lIdx}>{li.replace(/^[\s-*]+/, "")}</li>
                                        ))}
                                      </ul>
                                    );
                                  }
                                  return (
                                    <p key={idx} className="whitespace-pre-line">
                                      {para}
                                    </p>
                                  );
                                })}
                              </div>

                              <div className="pt-8 border-t border-[#f5f5f0] flex justify-between items-center text-3xs font-mono text-[#8c8a82]">
                                <span>Published: {blog.date} by Eshaan</span>
                                <button
                                  onClick={() => setExpandedBlogId(null)}
                                  className="underline hover:text-[#1c1b18] uppercase tracking-wider text-2xs"
                                >
                                  Close Essay &uarr;
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </article>
                  );
                })}
              </div>

              {/* Informative Help tip for adding perspective */}
              <div className="p-4 bg-[#f5f5f0] border border-[#e8e6df] text-center max-w-lg mx-auto text-3xs font-mono text-[#8c8a82] rounded-none">
                Want to write another architectural perspective? Open <strong>Customize Portfolio &rarr; Perspective Blog</strong> tab to draft live articles.
              </div>
            </motion.div>
          )}

          {/* JOURNAL TIMELINE TAB */}
          {activeTab === "journal" && (
            <motion.div
              key="journal-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-12"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#8c8a82] block mb-1">
                  Raw Daily Realizations
                </span>
                <h2 className="font-serif text-3xl font-light text-[#1c1b18]">
                  The Thought Log
                </h2>
                <p className="text-sm text-[#706e67] mt-1.5">
                  Micro-thoughts, raw design logs, books read, and geographic snapshots captured directly while working.
                </p>
              </div>

              {/* Journal Grid logs display */}
              <div id="journal-timeline-grid" className="relative pl-6 sm:pl-8 border-l border-[#e8e6df] space-y-10 py-4 max-w-2xl mx-auto">
                {journals.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    id={`journal-entry-${item.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="relative"
                  >
                    {/* Circle Node Indicator */}
                    <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#fbfbf9] border-2 border-[#af7034] z-10 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#af7034]"></div>
                    </div>

                    <div className="space-y-2 bg-[#fbfbf9]">
                      {/* Meta layout */}
                      <div className="flex flex-wrap items-baseline gap-2.5 font-mono text-3xs text-[#8c8a82]">
                        <span className="text-[#1c1b18] font-semibold">{item.date}</span>
                        {item.time && <span>• {item.time}</span>}
                        {item.location && (
                          <span className="flex items-center gap-0.5 whitespace-nowrap">
                            <MapPin className="w-2.5 h-2.5 inline text-[#a19f96]" /> {item.location}
                          </span>
                        )}
                        {item.mood && (
                          <span className="px-1.5 py-0.2 bg-[#f5f5f0] border border-[#e8e6df] uppercase font-mono italic pr-1.5">
                            {item.mood}
                          </span>
                        )}
                      </div>

                      {/* Content statement */}
                      <p className="text-sm text-[#383631] font-serif leading-relaxed whitespace-pre-line pt-1">
                        {item.content}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick interactive note reminder */}
              <div className="p-4 bg-[#f8f6f0] border border-[#e8e6df] text-center max-w-md mx-auto text-3xs font-mono text-[#8c8a82] rounded-none">
                Reflections of our digital hygiene are logged live. Customize your journal logs to append real day-to-day notes.
              </div>
            </motion.div>
          )}

          {/* CONTACT & FEED TAB (VISITOR FEED MESSAGE CONSOLE + DIRECT LINKING) */}
          {activeTab === "contact" && (
            <motion.div
              key="contact-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="space-y-16"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#8c8a82] block mb-1">
                  Connect & Commune
                </span>
                <h2 className="font-serif text-3xl font-light text-[#1c1b18]">
                  Start A Human Conversation
                </h2>
                <p className="text-sm text-[#706e67] mt-1.5">
                  I refuse recruiter spam. If you have questions about digital layouts, need design feedback, or want to project-collaborate, trigger a message below.
                </p>
              </div>

              {/* Half-Grid: Contact coordinates and dynamic feedback dispatcher */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans pt-4">
                
                {/* Coordinates Left Panel */}
                <div className="space-y-8">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-[#8c8a82] block mb-3">
                      Digital Coordinates
                    </span>
                    
                    <div className="space-y-4">
                      {/* Copy Email action */}
                      <div className="p-4 border border-[#e8e6df] bg-[#faf9f5] flex items-center justify-between group">
                        <div className="space-y-1">
                          <span className="block font-mono text-4xs uppercase tracking-wider text-[#8c8a82]">Direct Email Link</span>
                          <span className="font-mono text-xs font-semibold text-[#1c1b18] select-all">{settings.email}</span>
                        </div>
                        <button
                          id="copy-email-btn"
                          onClick={handleCopyEmail}
                          className="p-2 border border-[#e8e6df] text-[#706e67] hover:border-[#1c1b18] hover:bg-white hover:text-[#1c1b18] transition-all select-none"
                          title="Copy Email To Clipboard"
                        >
                          {copiedEmail ? (
                            <Check className="w-4 h-4 text-green-600 block" />
                          ) : (
                            <Copy className="w-4 h-4 block" />
                          )}
                        </button>
                      </div>

                      {/* Social handles list */}
                      <div className="p-4 border border-[#e8e6df] bg-[#fbfbf9] flex flex-wrap gap-4 items-center">
                        <span className="font-mono text-3xs uppercase tracking-wider text-[#8c8a82] mr-2">Networks:</span>
                        
                        {settings.github && (
                          <a
                            href={settings.github}
                            target="_blank"
                            rel="noreferrer referrer"
                            className="p-1.5 border border-[#e8e6df] text-[#706e67] hover:text-[#1c1b18] hover:border-[#1c1b18] transition-all inline-flex items-center gap-1.5 text-xs font-mono"
                          >
                            <Github className="w-4 h-4" /> Github
                          </a>
                        )}

                        {settings.linkedin && (
                          <a
                            href={settings.linkedin}
                            target="_blank"
                            rel="noreferrer referrer"
                            className="p-1.5 border border-[#e8e6df] text-[#706e67] hover:text-[#1c1b18] hover:border-[#1c1b18] transition-all inline-flex items-center gap-1.5 text-xs font-mono"
                          >
                            <Linkedin className="w-4 h-4" /> LinkedIn
                          </a>
                        )}

                        {settings.twitter && (
                          <a
                            href={settings.twitter}
                            target="_blank"
                            rel="noreferrer referrer"
                            className="p-1.5 border border-[#e8e6df] text-[#706e67] hover:text-[#1c1b18] hover:border-[#1c1b18] transition-all inline-flex items-center gap-1.5 text-xs font-mono"
                          >
                            <Twitter className="w-4 h-4" /> Twitter
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Informative advice */}
                  <div className="bg-[#f5f5f0] p-6 border border-[#e8e6df] space-y-2 text-xs text-[#706e67] leading-relaxed">
                    <h4 className="font-serif text-sm font-semibold text-[#1c1b18]">No Tracking Cookie Standards</h4>
                    <p>
                      This site incorporates absolutely zero tracking, analytic telemetry beams, or Google Ads tags. It serves pure static elements. Direct contact remains the only vector of analytics.
                    </p>
                  </div>
                </div>

                {/* Right Panel: Interactive visitor communication dispatch client-side */}
                <div className="space-y-6">
                  <div>
                    <span className="font-mono text-xs uppercase tracking-wider text-[#8c8a82] block mb-3">
                      Dynamic Dispatch Console
                    </span>
                    
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-4xs font-mono text-[#8c8a82] uppercase mb-1">Your Name</label>
                          <input
                            type="text"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs focus:outline-none focus:border-[#af7034]"
                            placeholder="Alex Mercer"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-4xs font-mono text-[#8c8a82] uppercase mb-1">Your Email</label>
                          <input
                            type="email"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs focus:outline-none focus:border-[#af7034]"
                            placeholder="alex@domain.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-4xs font-mono text-[#8c8a82] uppercase mb-1">Message Context / Inquiry</label>
                        <textarea
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          rows={4}
                          className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs focus:outline-none focus:border-[#af7034] resize-none"
                          placeholder="What project are you collaborating on? Do you need feedback on UI designs?..."
                          required
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          id="contact-submit-btn"
                          type="submit"
                          className="px-6 py-2 bg-[#1c1b18] text-[#fbfbf9] hover:bg-[#af7034] text-xs font-mono transition-colors flex items-center gap-1.5 active:scale-95 select-none"
                        >
                          <Send className="w-3.5 h-3.5" /> Dispatch Note
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Inform message */}
                  <AnimatePresence>
                    {contactSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-green-50 text-green-800 border-l-4 border-green-500 p-4 font-mono text-2xs space-y-1"
                      >
                        <div className="font-bold flex items-center gap-1">
                          <Check className="w-4 h-4 text-green-600" /> TRANSMISSION LOGGED
                        </div>
                        <p className="text-3xs text-green-700/95 font-sans leading-relaxed">
                          Your thought dispatch has successfully logged directly into the browser state ledger below! In a static site, this simulates a live server database natively.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* LIVE CLIENT-SIDE INBOX (Demonstrates interaction and persistent communication flow without unrequested server databases!) */}
              <div id="visitor-ledger-section" className="border-t border-[#e8e6df] pt-12 space-y-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#8c8a82] block mb-1">
                    Visitor Ledger Board
                  </span>
                  <h3 className="font-serif text-xl font-medium text-[#1c1b18]">
                    Shared Broadcast Notes
                  </h3>
                  <p className="text-sm text-[#706e67] mt-1">
                    A beautiful visual history of real-time messages submitted to this local browser instance. (Simulates client interactions!).
                  </p>
                </div>

                {visitorMessages.length === 0 ? (
                  <div className="py-12 border border-dashed border-[#e8e6df] text-center text-xs font-serif italic text-[#706e67] bg-[#faf9f5]">
                    No communication payloads currently dispatched top-side. Add yours in the form above!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {visitorMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-5 border border-[#e8e6df] bg-[#fdfdfb] flex flex-col justify-between hover:bg-[#faf9f3] transition-colors relative"
                      >
                        <div>
                          <div className="flex justify-between items-baseline font-mono text-4xs text-[#8c8a82] mb-3 border-b border-[#f5f5f0] pb-2">
                            <span>From: {msg.senderName} ({msg.senderEmail})</span>
                            <span>{msg.timestamp}</span>
                          </div>
                          <p className="text-xs text-[#383631] leading-relaxed font-sans italic">
                            "{msg.messageText}"
                          </p>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="text-4xs font-mono text-red-700 hover:text-red-900 underline"
                          >
                            Purge Note
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Aesthetic Footer Grid */}
      <footer id="portfolio-main-footer" className="border-t border-[#e8e6df] pt-12 mt-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 font-mono text-3xs text-[#8c8a82]">
        <div className="space-y-1 text-left">
          <p className="uppercase tracking-wider font-semibold text-[#1c1b18]">
            {settings.profileName} &copy; 2026
          </p>
          <p>
            Zero scripts block. Simple static presentation framework.
          </p>
        </div>

        <div className="flex gap-4 uppercase tracking-wider">
          <button
            onClick={() => setIsCreatorOpen(true)}
            className="text-[#af7034] hover:text-[#1c1b18] font-bold flex items-center gap-1 select-none"
          >
            <Sliders className="w-3.5 h-3.5" /> Studio Mode Console
          </button>
          <span>•</span>
          <button
            onClick={handleResetAll}
            className="hover:text-red-800 transition-colors select-none"
          >
            Reset State Defaults
          </button>
        </div>
      </footer>

      {/* Creator Workspace Side Drawer Panel */}
      <AnimatePresence>
        {isCreatorOpen && (
          <CreatorPanel
            isOpen={isCreatorOpen}
            onClose={() => setIsCreatorOpen(false)}
            settings={settings}
            onSaveSettings={handleSaveSettings}
            projects={projects}
            onSaveProject={handleSaveProject}
            onDeleteProject={handleDeleteProject}
            blogs={blogs}
            onSaveBlog={handleSaveBlog}
            onDeleteBlog={handleDeleteBlog}
            journals={journals}
            onSaveJournal={handleSaveJournal}
            onDeleteJournal={handleDeleteJournal}
            onResetAll={handleResetAll}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
