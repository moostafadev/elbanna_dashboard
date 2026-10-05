import { LOGIN_WINDOW_MS } from "./constants";

const MAX_TRACKED_KEYS = 1000;

const attempts = new Map<string, { count: number; resetAt: number }>();

const prune = (now: number) => {
  if (attempts.size < MAX_TRACKED_KEYS) return;

  for (const [key, entry] of attempts) {
    if (entry.resetAt <= now) attempts.delete(key);
  }

  if (attempts.size >= MAX_TRACKED_KEYS) attempts.clear();
};

export const consumeAttempt = (key: string, max: number): boolean => {
  const now = Date.now();
  prune(now);

  const entry = attempts.get(key);

  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return true;
  }

  if (entry.count >= max) return false;

  entry.count += 1;
  return true;
};

export const clearAttempts = (key: string): void => {
  attempts.delete(key);
};
