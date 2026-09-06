import { put } from "@vercel/blob";
import { tool } from "ai";
import { z } from "zod";

export const saveToBlob = tool({
  description:
    "Save a file to Vercel Blob Storage. Returns the public URL.",
  inputSchema: z.object({
    path: z.string().describe("File path, e.g. 'articles/hello.txt'"),
    content: z.string().describe("File content"),
    contentType: z.string().optional().describe("MIME type, e.g. 'text/plain'"),
  }),
  execute: async ({ path, content, contentType }) => {
    try {
      const { url } = await put(path, content, {
        access: "public",
        contentType: contentType || "text/plain",
      });
      return { success: true, url };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: `Failed to save to Blob: ${msg}` };
    }
  },
});