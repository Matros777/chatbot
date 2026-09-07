import { NextResponse } from "next/server";
import {
  getUserByVerificationToken,
  markEmailVerified,
} from "@/lib/db/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect("/login?error=invalid_token");
  }

  const users = await getUserByVerificationToken(token);

  if (users.length === 0) {
    return NextResponse.redirect("/login?error=invalid_token");
  }

  const [user] = users;

  // Токен истёк
  if (user.verificationExpires && user.verificationExpires < new Date()) {
    return NextResponse.redirect("/login?error=token_expired");
  }

  await markEmailVerified(user.id);

  return NextResponse.redirect("/login?verified=1");
}