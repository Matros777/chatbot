import { tool } from "ai";
import type { Session } from "next-auth";
import { z } from "zod";
import { getConversationMemory } from "@/lib/db/queries";

export function loadConversation({
  session,
}: {
  session: Session | null;
}) {
  return tool({
    description:
      "Load the user's conversation history. Call this FIRST at the start of every session to remember previous discussions.",
    inputSchema: z.object({
      confirm: z.string().optional().describe("Optional confirmation string"),
    }),
    execute: async ({ confirm: _confirm }) => {
      if (!session?.user?.id) {
        return {
          found: false,
          message: "No authenticated user. Cannot load conversation memory.",
          conversations: [],
        };
      }

      const result = await getConversationMemory({ userId: session.user.id });

      if (!result.found) {
        return {
          found: false,
          message:
            "No previous conversations found for this user. This is their first visit.",
          conversations: [],
        };
      }

      return {
        found: true,
        message: `Found previous conversation (${result.messages.length} messages).`,
        conversations: result.messages,
      };
    },
  });
}