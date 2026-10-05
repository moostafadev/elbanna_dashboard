import { SignJWT, jwtVerify } from "jose";
import type { SessionData } from "@/types/auth";
import { SESSION_MAX_AGE } from "./constants";

const getSecretKey = (): Uint8Array => {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be defined and at least 32 characters long",
    );
  }

  return new TextEncoder().encode(secret);
};

export const createSessionToken = (email: string): Promise<string> =>
  new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecretKey());

export const verifySessionToken = async (
  token?: string,
): Promise<SessionData | null> => {
  if (!token) return null;

  const key = getSecretKey();

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (
      typeof payload.email !== "string" ||
      !payload.exp ||
      payload.email !== adminEmail
    )
      return null;

    return { email: payload.email, expiresAt: new Date(payload.exp * 1000) };
  } catch {
    return null;
  }
};
