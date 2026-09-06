import { tool } from "ai";
import type { Session } from "next-auth";
import { z } from "zod";
import { saveConversationMemory } from "@/lib/db/queries";

export function saveConversation({
  session,
}: {
  session: Session | null;
}) {
  return tool({
    description:
      "Save the conversation history. Call this at the end of a session so the user's conversations are remembered.",
    inputSchema: z.object({
      messages: z
        .array(
          z.object({
            role: z.string().describe("Role: 'user' or 'assistant'"),
            content: z.string().describe("Message content"),
          })
        )
        .describe("Array of conversation messages"),
    }),
    execute: async ({ messages }) => {
      if (!session?.user?.id) {
        return {
          success: false,
          message: "No authenticated user. Cannot save conversation memory.",
        };
      }

      const result = await saveConversationMemory({
        userId: session.user.id,
        messages,
      });

      return {
        success: true,
        message: `Saved conversation history (${messages.length} messages).`,
      };
    },
  });
}