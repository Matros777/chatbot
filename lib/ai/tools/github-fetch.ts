import { tool } from "ai";
import { z } from "zod";

export const githubFetch = tool({
  description:
    "Fetch GitHub repository info or file contents. Get repo description, stars, or raw file content.",
  inputSchema: z.object({
    repo: z.string().describe("Repo in format 'owner/name', e.g. 'vercel/next.js'"),
    path: z.string().optional().describe("Optional file path in the repo, e.g. 'README.md'. If omitted, returns repo info."),
    branch: z.string().optional().describe("Branch name (default: 'main')"),
  }),
  execute: async ({ repo, path, branch = "main" }) => {
    try {
      if (path) {
        const url = `https://raw.githubusercontent.com/${repo}/${branch}/${path}`;
        const res = await fetch(url, { headers: { "User-Agent": "BuildAgent" } });
        if (!res.ok) return { success: false, error: `HTTP ${res.status}: file not found` };
        const content = await res.text();
        return { success: true, repo, path, branch, content: content.slice(0, 10000) };
      }

      const url = `https://api.github.com/repos/${repo}`;
      const res = await fetch(url, {
        headers: { Accept: "application/json", "User-Agent": "BuildAgent" },
      });
      if (!res.ok) return { success: false, error: `HTTP ${res.status}: ${res.statusText}` };
      const data = await res.json() as {
        full_name?: string;
        description?: string | null;
        stargazers_count?: number;
        forks_count?: number;
        language?: string | null;
        html_url?: string;
        default_branch?: string;
      };

      return {
        success: true,
        repo: data.full_name,
        description: data.description,
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language,
        url: data.html_url,
        defaultBranch: data.default_branch,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Failed: ${msg}` };
    }
  },
});