import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Github, Star, GitFork, ExternalLink, RefreshCw, AlertCircle, Sparkles } from "lucide-react";

interface GithubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

interface DynamicGitHubReposProps {
  username: string;
  onUsernameChange?: (newUsername: string) => void;
}

export default function DynamicGitHubRepos({
  username,
  onUsernameChange,
}: DynamicGitHubReposProps) {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputUsername, setInputUsername] = useState<string>(username);

  const fetchRepos = async (user: string) => {
    if (!user.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.github.com/users/${user}/repos?sort=updated&per_page=8`
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`GitHub user "${user}" not found.`);
        } else if (response.status === 403) {
          throw new Error("GitHub API limit reached. Please try again later.");
        } else {
          throw new Error("Could not retrieve repos at this time.");
        }
      }

      const data = await response.json();
      
      // Filter out forks if desired, or sort by stars
      const formattedRepos = data
        .filter((repo: any) => !repo.fork)
        .map((repo: any) => ({
          id: repo.id,
          name: repo.name,
          description: repo.description || "No description provided.",
          html_url: repo.html_url,
          stargazers_count: repo.stargazers_count,
          forks_count: repo.forks_count,
          language: repo.language || "TypeScript",
          updated_at: new Date(repo.updated_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          }),
        }));

      setRepos(formattedRepos);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching repositories.");
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos(username);
    setInputUsername(username);
  }, [username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUsernameChange && inputUsername.trim()) {
      onUsernameChange(inputUsername.trim());
    } else {
      fetchRepos(inputUsername.trim());
    }
  };

  return (
    <div id="github-repos-section" className="mt-16 pt-16 border-t border-[#e8e6df]">
      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-4">
        <div>
          <span className="font-mono text-xs text-[#8c8a82] uppercase tracking-wider block mb-1">
            Dynamic Integrations
          </span>
          <h3 className="font-serif text-2xl font-light text-[#1c1b18]">
            Live GitHub Broadcast
          </h3>
          <p className="text-sm text-[#706e67] mt-1">
            Active repositories synchronized instantly via the GitHub REST API.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-[#8c8a82]">
              github.com/
            </span>
            <input
              id="github-username-input"
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              className="bg-[#f5f5f0] border border-[#e8e6df] rounded-none px-3 py-1.5 pl-24 text-sm font-mono text-[#1c1b18] focus:outline-none focus:border-[#a19f96] placeholder-[#b8b6af] w-48 sm:w-60"
              placeholder="username"
            />
          </div>
          <button
            id="github-fetch-btn"
            type="submit"
            disabled={loading}
            className="px-4 py-1.5 bg-[#1c1b18] text-[#fbfbf9] hover:bg-[#383631] transition-colors text-xs font-mono disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Link"}
          </button>
        </form>
      </div>

      {loading ? (
        <div id="github-repos-loading" className="grid grid-cols-1 md:grid-cols-2 gap-4 py-12">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border border-[#e8e6df] p-6 bg-[#fbfbf9] h-40 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="h-4 bg-[#f5f5f0] w-1/3 rounded-sm"></div>
                <div className="h-3 bg-[#f5f5f0] w-3/4 rounded-sm"></div>
                <div className="h-3 bg-[#f5f5f0] w-1/2 rounded-sm"></div>
              </div>
              <div className="h-4 bg-[#f5f5f0] w-1/4 rounded-sm"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div id="github-repos-error" className="py-12 px-6 border border-dashed border-[#e8e6df] bg-[#fdfdfb] text-center max-w-lg mx-auto">
          <AlertCircle className="w-6 h-6 mx-auto mb-3 text-[#af4034]" />
          <h4 className="font-serif text-lg text-[#1c1b18] mb-1">Failed to Connect</h4>
          <p className="text-xs text-[#8c8a82] font-mono mb-4">{error}</p>
          <div className="text-xs text-[#706e67]">
            Please enter a valid username above or check your network connection. Try clicking <button type="button" onClick={() => { setInputUsername("eshaankalyan"); if(onUsernameChange)onUsernameChange("eshaankalyan"); }} className="underline font-mono text-[#1c1b18]">eshaankalyan</button> to see demo action.
          </div>
        </div>
      ) : repos.length === 0 ? (
        <div id="github-repos-empty" className="py-12 text-center border border-dashed border-[#e8e6df] bg-[#f8f6f0]">
          <p className="text-sm font-serif italic text-[#706e67]">
            No public, non-forked repositories found for this user.
          </p>
        </div>
      ) : (
        <motion.div
          id="github-repos-grid"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {repos.map((repo, idx) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer referrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              whileHover={{ y: -3, borderColor: "#a19f96" }}
              className="border border-[#e8e6df] p-6 bg-[#fbfbf9] hover:bg-[#f8f8f3] transition-all flex flex-col justify-between group cursor-pointer relative"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs px-2 py-0.5 bg-[#f5f5f0] border border-[#e8e6df] text-[#706e67] rounded-none group-hover:bg-[#1c1b18] group-hover:text-[#fbfbf9] group-hover:border-[#1c1b18] transition-colors">
                    {repo.language}
                  </span>
                  <span className="font-mono text-2xs text-[#8c8a82]">
                    Sync: {repo.updated_at}
                  </span>
                </div>

                <h4 className="font-serif text-lg font-medium text-[#1c1b18] group-hover:text-[#af7034] transition-colors flex items-center gap-1.5 pt-1">
                  {repo.name}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#a19f96]" />
                </h4>

                <p className="text-xs text-[#75736c] line-clamp-2 mt-2 leading-relaxed">
                  {repo.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#f5f5f0] font-mono text-xs text-[#8c8a82]">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#a19f96]" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3 h-3 text-[#a19f96]" />
                    {repo.forks_count}
                  </span>
                </div>
                <span className="text-[#a19f96] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 text-2xs uppercase tracking-wider">
                  View Repo &rarr;
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}

      <div className="flex items-center justify-center gap-2 mt-8 text-2xs font-mono text-[#8c8a82]">
        <Sparkles className="w-3.5 h-3.5 text-[#af7034]" />
        <span>Hosting this portfolio on GitHub Pages will immediately feed repositories from your real-time account.</span>
      </div>
    </div>
  );
}
