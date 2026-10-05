import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import type { SessionData } from "@/types/auth";
import { SESSION_COOKIE } from "./constants";
import { verifySessionToken } from "./session";

export const getSession = cache(
  async (): Promise<SessionData | null> =>
    verifySessionToken(cookies().get(SESSION_COOKIE)?.value),
);

export const isAdmin = async (): Promise<boolean> =>
  (await getSession()) !== null;
