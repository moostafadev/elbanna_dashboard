"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { LoginInput, LoginResult } from "@/types/auth";
import {
  LOGIN_MAX_ATTEMPTS_GLOBAL,
  LOGIN_MAX_ATTEMPTS_PER_IP,
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from "@/lib/auth/constants";
import { authenticateAdmin } from "@/lib/auth/credentials";
import { clearAttempts, consumeAttempt } from "@/lib/auth/rate-limit";
import { createSessionToken } from "@/lib/auth/session";

const getClientIp = (): string => {
  const headerStore = headers();
  const forwarded = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();

  return forwarded || headerStore.get("x-real-ip") || "unknown";
};

export async function login(input: LoginInput): Promise<LoginResult> {
  const email = typeof input?.email === "string" ? input.email.trim() : "";
  const password = typeof input?.password === "string" ? input.password : "";

  if (
    !email ||
    !password ||
    email.length > MAX_EMAIL_LENGTH ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return { success: false, error: "MISSING_FIELDS" };
  }

  const ipKey = `ip:${getClientIp()}`;

  if (
    !consumeAttempt(ipKey, LOGIN_MAX_ATTEMPTS_PER_IP) ||
    !consumeAttempt("global", LOGIN_MAX_ATTEMPTS_GLOBAL)
  ) {
    return { success: false, error: "TOO_MANY_ATTEMPTS" };
  }

  try {
    const admin = await authenticateAdmin(email, password);

    if (!admin) return { success: false, error: "INVALID_CREDENTIALS" };

    const token = await createSessionToken(admin.email);

    cookies().set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    clearAttempts(ipKey);
    return { success: true };
  } catch (error) {
    console.error("[login]", error);
    return { success: false, error: "SERVER_ERROR" };
  }
}

export async function logout(): Promise<void> {
  cookies().delete(SESSION_COOKIE);
  redirect("/login");
}
