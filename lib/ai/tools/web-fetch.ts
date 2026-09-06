import { tool } from "ai";
import { z } from "zod";

export const webFetch = tool({
  description:
    "Fetch the content of a web page by URL and return its text. Use this to read news articles, documentation, or any web page.",
  inputSchema: z.object({
    url: z.string().describe("Full URL to fetch, e.g. 'https://example.com/page'"),
    maxLength: z.number().optional().describe("Max characters to return (default: 5000)"),
  }),
  execute: async ({ url, maxLength = 5000 }) => {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; BuildAgent/1.0)",
          Accept: "text/html,text/plain,application/json",
        },
      });

      if (!res.ok) {
        return { success: false, error: `HTTP ${res.status}: ${res.statusText}` };
      }

      const contentType = res.headers.get("content-type") || "";
      let body = await res.text();

      if (contentType.includes("application/json")) {
        try {
          body = JSON.stringify(JSON.parse(body), null, 2);
        } catch {
          /* keep raw */
        }
      }

      if (contentType.includes("text/html")) {
        body = body
          .replace(/<script[\s\S]*?<\/script>/gi, " ")
          .replace(/<style[\s\S]*?<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
      }

      if (body.length > maxLength) {
        body = body.slice(0, maxLength) + "\n...[truncated]";
      }

      return { success: true, url, content: body };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Fetch failed: ${msg}` };
    }
  },
});