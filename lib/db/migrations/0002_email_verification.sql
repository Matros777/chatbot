ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verificationToken" text;
--> statement-breakpoint
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "verificationExpires" timestamp;