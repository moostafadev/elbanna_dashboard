import "server-only";
import { createHash, scrypt, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;
const HASH_FORMAT = /^[0-9a-f]{32}:[0-9a-f]{128}$/i;

const digest = (value: string): Buffer =>
  createHash("sha256").update(value).digest();

const safeEqual = (a: string, b: string): boolean =>
  timingSafeEqual(digest(a), digest(b));

const deriveKey = (password: string, salt: Buffer): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });

const getAdminConfig = () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH?.trim();

  if (!email || !passwordHash || !HASH_FORMAT.test(passwordHash)) {
    throw new Error("ADMIN_EMAIL or ADMIN_PASSWORD_HASH is missing or invalid");
  }

  return { email, passwordHash };
};

const verifyPassword = async (
  password: string,
  stored: string,
): Promise<boolean> => {
  const [saltHex, hashHex] = stored.split(":");
  const derived = await deriveKey(password, Buffer.from(saltHex, "hex"));

  return timingSafeEqual(derived, Buffer.from(hashHex, "hex"));
};

export const authenticateAdmin = async (
  email: string,
  password: string,
): Promise<{ email: string } | null> => {
  const config = getAdminConfig();
  const emailMatches = safeEqual(email.trim().toLowerCase(), config.email);
  const passwordMatches = await verifyPassword(password, config.passwordHash);

  return emailMatches && passwordMatches ? { email: config.email } : null;
};
