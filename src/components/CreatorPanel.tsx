import React, { useState } from "react";
import { Project, Blog, Journal, ProjectSettings } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Check, Plus, Edit2, Trash2, Sliders, FileText, Briefcase, BookOpen, 
  Download, RotateCcw, HelpCircle, Eye
} from "lucide-react";

interface CreatorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProjectSettings;
  onSaveSettings: (settings: ProjectSettings) => void;
  projects: Project[];
  onSaveProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  blogs: Blog[];
  onSaveBlog: (blog: Blog) => void;
  onDeleteBlog: (id: string) => void;
  journals: Journal[];
  onSaveJournal: (journal: Journal) => void;
  onDeleteJournal: (id: string) => void;
  onResetAll: () => void;
}

export default function CreatorPanel({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  projects,
  onSaveProject,
  onDeleteProject,
  blogs,
  onSaveBlog,
  onDeleteBlog,
  journals,
  onSaveJournal,
  onDeleteJournal,
  onResetAll
}: CreatorPanelProps) {
  const [activeTab, setActiveTab] = useState<"settings" | "projects" | "blogs" | "journals" | "backup">("settings");
  
  // Settings edit state
  const [editSettings, setEditSettings] = useState<ProjectSettings>({ ...settings });
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Selected item for editing
  const [selectedProjectId, setSelectedProjectId] = useState<string>("new");
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    title: "", description: "", date: "", tags: [], role: "", codeLanguage: "", content: ""
  });

  const [selectedBlogId, setSelectedBlogId] = useState<string>("new");
  const [blogForm, setBlogForm] = useState<Partial<Blog>>({
    title: "", date: "", readTime: "4 min read", category: "Perspective", previewText: "", content: ""
  });

  const [selectedJournalId, setSelectedJournalId] = useState<string>("new");
  const [journalForm, setJournalForm] = useState<Partial<Journal>>({
    date: "", location: "Studio Desk", content: "", mood: "Reflective"
  });

  const [copyNotification, setCopyNotification] = useState<string | null>(null);

  const triggerCopyNotification = (msg: string) => {
    setCopyNotification(msg);
    setTimeout(() => setCopyNotification(null), 3000);
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(editSettings);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  // Projects logic
  const loadProjectToForm = (id: string) => {
    setSelectedProjectId(id);
    if (id === "new") {
      setProjectForm({ title: "", description: "", date: "", tags: [], role: "", codeLanguage: "", content: "" });
    } else {
      const p = projects.find(item => item.id === id);
      if (p) setProjectForm({ ...p });
    }
  };

  const handleSaveProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) return;
    const finalId = selectedProjectId === "new" ? `project-${Date.now()}` : selectedProjectId;
    onSaveProject({
      id: finalId,
      title: projectForm.title || "",
      description: projectForm.description || "",
      date: projectForm.date || new Date().toISOString().substring(0, 7),
      tags: projectForm.tags || ["TypeScript"],
      link: projectForm.link || undefined,
      githubUrl: projectForm.githubUrl || undefined,
      role: projectForm.role || "Solo Creator",
      codeLanguage: projectForm.codeLanguage || "TypeScript",
      isFeatured: projectForm.isFeatured ?? false,
      content: projectForm.content || ""
    });
    triggerCopyNotification("Project entry published to local environment.");
    loadProjectToForm("new");
  };

  // Blogs logic
  const loadBlogToForm = (id: string) => {
    setSelectedBlogId(id);
    if (id === "new") {
      setBlogForm({ title: "", date: "", readTime: "3 min read", category: "Perspective", previewText: "", content: "" });
    } else {
      const b = blogs.find(item => item.id === id);
      if (b) setBlogForm({ ...b });
    }
  };

  const handleSaveBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) return;
    const finalId = selectedBlogId === "new" ? `blog-${Date.now()}` : selectedBlogId;
    
    // Estimate read time
    const wordCount = blogForm.content.split(/\s+/).length;
    const minutes = Math.max(1, Math.round(wordCount / 200));
    
    onSaveBlog({
      id: finalId,
      title: blogForm.title || "",
      date: blogForm.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      readTime: `${minutes} min read`,
      previewText: blogForm.previewText || blogForm.content.substring(0, 120) + "...",
      content: blogForm.content || "",
      category: blogForm.category || "Perspective"
    });
    triggerCopyNotification("Blog perspective saved and rendered.");
    loadBlogToForm("new");
  };

  // Journal logic
  const loadJournalToForm = (id: string) => {
    setSelectedJournalId(id);
    if (id === "new") {
      setJournalForm({ date: "", location: "Studio Desk", content: "", mood: "Reflective" });
    } else {
      const j = journals.find(item => item.id === id);
      if (j) setJournalForm({ ...j });
    }
  };

  const handleSaveJournalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalForm.content) return;
    const finalId = selectedJournalId === "new" ? `journal-${Date.now()}` : selectedJournalId;
    const now = new Date();
    onSaveJournal({
      id: finalId,
      date: journalForm.date || now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      location: journalForm.location || "Studio Desk",
      content: journalForm.content || "",
      mood: journalForm.mood || "Focused"
    });
    triggerCopyNotification("Journal reflection recorded.");
    loadJournalToForm("new");
  };

  const handleExportAll = () => {
    const backupObj = {
      settings,
      projects,
      blogs,
      journals
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupObj, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "portfolio_config.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerCopyNotification("Exported state JSON downloaded!");
  };

  const copyConfigToClipboard = () => {
    const backupObj = {
      settings,
      projects,
      blogs,
      journals
    };
    navigator.clipboard.writeText(JSON.stringify(backupObj, null, 2));
    triggerCopyNotification("Config copied to clipboard! Ready to paste.");
  };

  if (!isOpen) return null;

  return (
    <div id="creator-workspace-container" className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs font-sans">
      <motion.div
        id="creator-sidebar-panel"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="w-full max-w-2xl bg-[#faf9f5] h-full shadow-2xl flex flex-col border-l border-[#e8e6df] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#e8e6df] flex justify-between items-center bg-[#f5f5f0]">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#af7034] font-semibold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Studio Workspace
            </span>
            <h2 className="font-serif text-xl font-medium text-[#1c1b18] mt-1">
              Live Creator & Content Studio
            </h2>
          </div>
          <button
            id="workspace-close-btn"
            onClick={onClose}
            className="p-1.5 rounded-none border border-[#e8e6df] hover:border-[#a19f96] hover:bg-[#eaeae0] transition-all text-[#706e67]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Sub-tabs */}
        <div id="studio-subtabs" className="flex border-b border-[#e8e6df] bg-[#faf9f5] overflow-x-auto text-xs font-mono">
          {[
            { id: "settings", label: "Profile Settings", icon: Sliders },
            { id: "projects", label: "Custom Projects", icon: Briefcase },
            { id: "blogs", label: "Perspective Blog", icon: BookOpen },
            { id: "journals", label: "Thought Journal", icon: FileText },
            { id: "backup", label: "Bake Configuration", icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-3 border-r border-[#e8e6df] whitespace-nowrap transition-colors select-none ${
                  activeTab === tab.id
                    ? "bg-[#faf9f5] text-[#1c1b18] border-b-2 border-b-[#af7034] font-medium"
                    : "bg-[#f5f5f0] text-[#706e67] hover:bg-[#eaeae3]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence mode="wait">
            {activeTab === "settings" && (
              <motion.div
                key="settings-studio"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="bg-[#f5f5f0] p-4 border border-[#e8e6df] text-xs text-[#706e67] leading-relaxed">
                  <strong>Live Synchronization:</strong> These settings govern what displays on your Home page, the contact link emails, and dynamic social icons. Editing here updates your web instance immediately.
                </div>

                <form onSubmit={handleSaveSettingsSubmit} className="space-y-4 font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Your Full Name</label>
                      <input
                        type="text"
                        value={editSettings.profileName}
                        onChange={(e) => setEditSettings({ ...editSettings, profileName: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] rounded-none px-3 py-2 text-sm text-[#1c1b18] focus:outline-none focus:border-[#af7034]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Your Role / Headline</label>
                      <input
                        type="text"
                        value={editSettings.profileRole}
                        onChange={(e) => setEditSettings({ ...editSettings, profileRole: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] rounded-none px-3 py-2 text-sm text-[#1c1b18] focus:outline-none focus:border-[#af7034]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Biography / Tagline</label>
                    <textarea
                      value={editSettings.profileBio}
                      onChange={(e) => setEditSettings({ ...editSettings, profileBio: e.target.value })}
                      rows={3}
                      className="w-full bg-[#fbfbf9] border border-[#e8e6df] rounded-none px-3 py-2 text-sm text-[#1c1b18] focus:outline-none focus:border-[#af7034] resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#e8e6df] pt-4">
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Contact Email</label>
                      <input
                        type="email"
                        value={editSettings.email}
                        onChange={(e) => setEditSettings({ ...editSettings, email: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] rounded-none px-3 py-2 text-sm text-[#1c1b18] focus:outline-none focus:border-[#af7034]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Default GitHub Username</label>
                      <input
                        type="text"
                        value={editSettings.githubUsername}
                        onChange={(e) => setEditSettings({ ...editSettings, githubUsername: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] rounded-none px-3 py-2 text-sm text-[#1c1b18] focus:outline-none focus:border-[#af7034]"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#e8e6df] pt-4">
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">LinkedIn URL</label>
                      <input
                        type="text"
                        value={editSettings.linkedin || ""}
                        onChange={(e) => setEditSettings({ ...editSettings, linkedin: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] rounded-none px-3 py-2 text-sm text-[#1c1b18] focus:outline-none focus:border-[#af7034]"
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Twitter URL</label>
                      <input
                        type="text"
                        value={editSettings.twitter || ""}
                        onChange={(e) => setEditSettings({ ...editSettings, twitter: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] rounded-none px-3 py-2 text-sm text-[#1c1b18] focus:outline-none focus:border-[#af7034]"
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">GitHub Profile URL</label>
                      <input
                        type="text"
                        value={editSettings.github || ""}
                        onChange={(e) => setEditSettings({ ...editSettings, github: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] rounded-none px-3 py-2 text-sm text-[#1c1b18] focus:outline-none focus:border-[#af7034]"
                        placeholder="https://"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#1c1b18] text-[#fbfbf9] text-xs font-mono hover:bg-[#af7034] transition-colors flex items-center gap-1.5"
                    >
                      {settingsSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" /> State Updated
                        </>
                      ) : (
                        "Save Profile State"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === "projects" && (
              <motion.div
                key="projects-studio"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Selector */}
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-mono text-[#8c8a82] whitespace-nowrap">Edit Project:</span>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => loadProjectToForm(e.target.value)}
                    className="flex-1 bg-[#fbfbf9] border border-[#e8e6df] p-1.5 text-xs font-mono focus:outline-none focus:border-[#af7034] rounded-none"
                  >
                    <option value="new">+ Write New Custom Project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>Edit: {p.title}</option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleSaveProjectSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Project Title *</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18] focus:outline-none focus:border-[#af7034]"
                        placeholder="Aura zen editor"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Creation Date (YYYY-MM)</label>
                      <input
                        type="month"
                        value={projectForm.date}
                        onChange={(e) => setProjectForm({ ...projectForm, date: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Brief Pitch / Summary Description *</label>
                    <input
                      type="text"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18] focus:outline-none"
                      placeholder="A distraction-free typography canvas designed for pure writing focus"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Your Role / Duty</label>
                      <input
                        type="text"
                        value={projectForm.role}
                        onChange={(e) => setProjectForm({ ...projectForm, role: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18]"
                        placeholder="Solo Creator"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Primary Code Language</label>
                      <input
                        type="text"
                        value={projectForm.codeLanguage}
                        onChange={(e) => setProjectForm({ ...projectForm, codeLanguage: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18]"
                        placeholder="TypeScript"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Tech Tag Strings (comma-separated)</label>
                      <input
                        type="text"
                        value={projectForm.tags?.join(", ")}
                        onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18]"
                        placeholder="React, CSS, Golden Ratio"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Demo Site URL (optional)</label>
                      <input
                        type="url"
                        value={projectForm.link || ""}
                        onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18]"
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">GitHub Repository URL (optional)</label>
                      <input
                        type="url"
                        value={projectForm.githubUrl || ""}
                        onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18]"
                        placeholder="https://"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Featured Layout Position</label>
                    <label className="inline-flex items-center gap-2 mt-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={projectForm.isFeatured || false}
                        onChange={(e) => setProjectForm({ ...projectForm, isFeatured: e.target.checked })}
                        className="rounded-none border-[#e8e6df] text-[#af7034] focus:ring-0"
                      />
                      <span className="text-xs text-[#706e67]">Display this prominently on the home page showcase list</span>
                    </label>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase">Project Detail Text / Breakdown</label>
                      <span className="text-5xs text-[#a19f96] uppercase font-mono">Paragraphs rendered on row click</span>
                    </div>
                    <textarea
                      value={projectForm.content}
                      onChange={(e) => setProjectForm({ ...projectForm, content: e.target.value })}
                      rows={4}
                      className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18] resize-none focus:outline-none"
                      placeholder="Add design challenges, structural choices, or help insights here..."
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[#e8e6df]">
                    {selectedProjectId !== "new" ? (
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteProject(selectedProjectId);
                          loadProjectToForm("new");
                          triggerCopyNotification("Project entry deleted.");
                        }}
                        className="px-4 py-2 border border-[#af4034] text-[#af4034] text-xs font-mono hover:bg-[#af4034]/10 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Project
                      </button>
                    ) : (
                      <div></div>
                    )}

                    <div className="flex gap-2">
                      {selectedProjectId !== "new" && (
                        <button
                          type="button"
                          onClick={() => loadProjectToForm("new")}
                          className="px-4 py-2 border border-[#e8e6df] text-[#706e67] text-xs font-mono hover:bg-[#eaeae3]"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#1c1b18] text-[#fbfbf9] text-xs font-mono hover:bg-[#af7034] transition-colors"
                      >
                        {selectedProjectId === "new" ? "Build Project Entry" : "Apply Modifications"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === "blogs" && (
              <motion.div
                key="blogs-studio"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Selector */}
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-mono text-[#8c8a82] whitespace-nowrap">Edit Blog:</span>
                  <select
                    value={selectedBlogId}
                    onChange={(e) => loadBlogToForm(e.target.value)}
                    className="flex-1 bg-[#fbfbf9] border border-[#e8e6df] p-1.5 text-xs font-mono rounded-none"
                  >
                    <option value="new">+ Write New Blog Post</option>
                    {blogs.map(b => (
                      <option key={b.id} value={b.id}>Edit: {b.title}</option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleSaveBlogSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Blog Title *</label>
                      <input
                        type="text"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18] focus:outline-none focus:border-[#af7034]"
                        placeholder="Minimalism is respect..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Published Date Phrase</label>
                      <input
                        type="text"
                        value={blogForm.date}
                        onChange={(e) => setBlogForm({ ...blogForm, date: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18]"
                        placeholder="May 27, 2026"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Category / Tag</label>
                      <input
                        type="text"
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18]"
                        placeholder="Perspective"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Preview Teaser *</label>
                      <input
                        type="text"
                        value={blogForm.previewText}
                        onChange={(e) => setBlogForm({ ...blogForm, previewText: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18]"
                        placeholder="A brief editorial quote..."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-baseline mb-1">
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase">Core Content (Markdown Supported)</label>
                      <span className="text-4xs text-[#af7034] font-mono flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Fully Drafts Real Articles
                      </span>
                    </div>
                    <textarea
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                      rows={8}
                      className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18] font-mono resize-none focus:outline-none"
                      placeholder="Type your markdown articles here...\n\nUse standard title headings, list items, or linebreaks."
                      required
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[#e8e6df]">
                    {selectedBlogId !== "new" ? (
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteBlog(selectedBlogId);
                          loadBlogToForm("new");
                          triggerCopyNotification("Blog post deleted.");
                        }}
                        className="px-4 py-2 border border-[#af4034] text-[#af4034] text-xs font-mono hover:bg-[#af4034]/10 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Post
                      </button>
                    ) : (
                      <div></div>
                    )}

                    <div className="flex gap-2">
                      {selectedBlogId !== "new" && (
                        <button
                          type="button"
                          onClick={() => loadBlogToForm("new")}
                          className="px-4 py-2 border border-[#e8e6df] text-[#706e67] text-xs font-mono hover:bg-[#eaeae3]"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#1c1b18] text-[#fbfbf9] text-xs font-mono hover:bg-[#af7034] transition-colors"
                      >
                        {selectedBlogId === "new" ? "Publish Blog" : "Apply Mod"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === "journals" && (
              <motion.div
                key="journals-studio"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Selector */}
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-mono text-[#8c8a82] whitespace-nowrap">Edit Log:</span>
                  <select
                    value={selectedJournalId}
                    onChange={(e) => loadJournalToForm(e.target.value)}
                    className="flex-1 bg-[#fbfbf9] border border-[#e8e6df] p-1.5 text-xs font-mono rounded-none"
                  >
                    <option value="new">+ Record New Thought Log</option>
                    {journals.map(j => (
                      <option key={j.id} value={j.id}>Edit Entry: {j.date} ({j.mood || "Calm"})</option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleSaveJournalSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Log Date</label>
                      <input
                        type="text"
                        value={journalForm.date}
                        onChange={(e) => setJournalForm({ ...journalForm, date: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18]"
                        placeholder="May 27, 2026"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Location Footprint</label>
                      <input
                        type="text"
                        value={journalForm.location}
                        onChange={(e) => setJournalForm({ ...journalForm, location: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18]"
                        placeholder="Studio Desk"
                      />
                    </div>
                    <div>
                      <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">State / Mood Accent</label>
                      <input
                        type="text"
                        value={journalForm.mood}
                        onChange={(e) => setJournalForm({ ...journalForm, mood: e.target.value })}
                        className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18]"
                        placeholder="Reflective"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">Daily Notes / Thought Content *</label>
                    <textarea
                      value={journalForm.content}
                      onChange={(e) => setJournalForm({ ...journalForm, content: e.target.value })}
                      rows={5}
                      className="w-full bg-[#fbfbf9] border border-[#e8e6df] px-3 py-2 text-xs text-[#1c1b18] resize-none focus:outline-none"
                      placeholder="Add raw day-to-day notes, realizations, design bookmarks, or perspectives here..."
                      required
                    />
                  </div>

                  <div className="flex justify-between pt-4 border-t border-[#e8e6df]">
                    {selectedJournalId !== "new" ? (
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteJournal(selectedJournalId);
                          loadJournalToForm("new");
                          triggerCopyNotification("Journal reflection deleted.");
                        }}
                        className="px-4 py-2 border border-[#af4034] text-[#af4034] text-xs font-mono hover:bg-[#af4034]/10 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Entry
                      </button>
                    ) : (
                      <div></div>
                    )}

                    <div className="flex gap-2">
                      {selectedJournalId !== "new" && (
                        <button
                          type="button"
                          onClick={() => loadJournalToForm("new")}
                          className="px-4 py-2 border border-[#e8e6df] text-[#706e67] text-xs font-mono hover:bg-[#eaeae3]"
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="submit"
                        className="px-6 py-2 bg-[#1c1b18] text-[#fbfbf9] text-xs font-mono hover:bg-[#af7034] transition-colors"
                      >
                        {selectedJournalId === "new" ? "Record Reflection" : "Apply Mod"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === "backup" && (
              <motion.div
                key="backup-studio"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="p-4 border border-[#e8e6df] bg-[#f8f7f1] space-y-3 font-sans">
                  <h4 className="text-sm font-semibold text-[#1c1b18] flex items-center gap-1">
                    <Download className="w-4 h-4 text-[#af7034]" /> Ready for GitHub pages?
                  </h4>
                  <p className="text-xs text-[#706e67] leading-relaxed">
                    This website persists entries securely in your browser's local state pool. However, if you are publishing this code to <strong>GitHub Pages</strong>, you can download your custom entries as a clean JSON configuration tree. 
                  </p>
                  <p className="text-xs text-[#75736c] italic">
                    Paste the contents directly into your <code>/src/data.ts</code> to serialize your modifications into the permanent static bundle file, so all visitors see your updates by default!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleExportAll}
                    className="flex-1 justify-center py-2.5 bg-[#1c1b18] text-[#fbfbf9] hover:bg-[#af7034] text-xs font-mono transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download Config File
                  </button>
                  <button
                    onClick={copyConfigToClipboard}
                    className="flex-1 justify-center py-2.5 border border-[#1c1b18] text-[#1c1b18] hover:bg-[#eaeae3] text-xs font-mono transition-colors flex items-center gap-2"
                  >
                    Copy JSON Tree To Clipboard
                  </button>
                </div>

                <div className="border-t border-[#e8e6df] pt-4 space-y-4">
                  <div className="flex justify-between items-center bg-red-50/50 p-4 border border-red-200/40">
                    <div>
                      <h4 className="text-xs font-bold text-red-900">Developer Rescue Switch</h4>
                      <p className="text-4xs font-mono text-red-700/80 mt-1">Clears local storage and restores designer defaults</p>
                    </div>
                    <button
                      onClick={() => {
                        if (confirm("Reset current entries to initial defaults?")) {
                          onResetAll();
                          triggerCopyNotification("Restored template defaults successfully.");
                        }
                      }}
                      className="px-3 py-1 bg-red-800 text-white rounded-none hover:bg-red-900 transition-colors text-4xs font-mono flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-mono text-[#8c8a82] uppercase mb-1">State Config Preview</label>
                  <pre className="bg-[#1c1b18] text-[#e5e5e0] p-4 text-4xs font-mono rounded-none overflow-x-auto max-h-52 overflow-y-auto w-full select-all">
                    {JSON.stringify({ settings, projects, blogs, journals }, null, 2)}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info and Notification */}
        <div className="p-4 border-t border-[#e8e6df] bg-[#f5f5f0] flex justify-between items-center text-4xs font-mono text-[#8c8a82]">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3 h-3" /> State persisted in LocalStorage
          </span>
          <AnimatePresence>
            {copyNotification && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="bg-[#af7034] text-[#fbfbf9] px-2 py-0.5"
              >
                {copyNotification}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
