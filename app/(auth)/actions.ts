"use server";

import { z } from "zod";
import { Resend } from "resend";
import { randomBytes } from "crypto";

import { createUser, getUser } from "@/lib/db/queries";

import { signIn } from "./auth";

const authFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const APP_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://chatbot-gold-iota-13.vercel.app";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM ?? "Chatbot <onboarding@resend.dev>";

function generateVerificationToken(): string {
  return randomBytes(32).toString("hex");
}

export type LoginActionState = {
  status: "idle" | "in_progress" | "success" | "failed" | "invalid_data";
};

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};

export type RegisterActionState = {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "sent_verification"
    | "failed"
    | "user_exists"
    | "invalid_data";
};

export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const [existingUser] = await getUser(validatedData.email);

    if (existingUser) {
      return { status: "user_exists" } as RegisterActionState;
    }

    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 час

    await createUser(
      validatedData.email,
      validatedData.password,
      verificationToken,
      verificationExpires
    );

    // Отправляем письмо с подтверждением
    if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY);
      const verifyUrl = `${APP_URL}/verify-email?token=${verificationToken}`;

      const { error } = await resend.emails.send({
        from: EMAIL_FROM,
        to: [validatedData.email],
        subject: "Confirm your email - chatbot-gold-iota",
        html: `
          <div style="font-family:Arial,sans-serif;background:#0a0a0f;color:#e8eaf0;padding:40px;text-align:center">
            <h2 style="color:#e8eaf0">Confirm your email</h2>
            <p style="color:#c8ccd4">Click the button below to verify your account.</p>
            <a href="${verifyUrl}" style="display:inline-block;background:#3b82f6;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:bold;margin:20px 0">
              Confirm email
            </a>
            <p style="color:#8b909c;font-size:14px">Or copy this link:<br/>${verifyUrl}</p>
            <p style="color:#8b909c;font-size:13px;margin-top:20px">This link expires in 1 hour.</p>
          </div>
        `,
      });

      if (error) {
        return { status: "failed" } as RegisterActionState;
      }
    }

    return { status: "sent_verification" } as RegisterActionState;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
