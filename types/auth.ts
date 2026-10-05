export interface LoginInput {
  email: string;
  password: string;
}

export type AuthErrorCode =
  | "MISSING_FIELDS"
  | "INVALID_CREDENTIALS"
  | "TOO_MANY_ATTEMPTS"
  | "SERVER_ERROR";

export type LoginResult =
  | { success: true }
  | { success: false; error: AuthErrorCode };

export interface SessionData {
  email: string;
  expiresAt: Date;
}
