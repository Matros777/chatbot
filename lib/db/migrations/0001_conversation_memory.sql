CREATE TABLE IF NOT EXISTS "ConversationMemory" (
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"messages" json NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"userId" uuid NOT NULL REFERENCES "User"("id")
);
--> statement-breakpoint
ALTER TABLE "ConversationMemory" ADD CONSTRAINT "ConversationMemory_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;