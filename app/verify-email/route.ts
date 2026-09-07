import { NextResponse } from "next/server";
import {
  getUserByVerificationToken,
  markEmailVerified,
} from "@/lib/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const origin = new URL(request.url).origin;

  if (!token) {
    return NextResponse.redirect(`${origin}/login?error=invalid_token`);
  }

  const users = await getUserByVerificationToken(token);

  if (users.length === 0) {
    return NextResponse.redirect(`${origin}/login?error=invalid_token`);
  }

  const [user] = users;

  // Токен истёк
  if (user.verificationExpires && user.verificationExpires < new Date()) {
    return NextResponse.redirect(`${origin}/login?error=token_expired`);
  }

  await markEmailVerified(user.id);

  return NextResponse.redirect(`${origin}/login?verified=1`);
}