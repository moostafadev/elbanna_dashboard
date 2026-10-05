import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];

if (!password || password.length < 8) {
  console.error(
    'Usage: node scripts/hash-password.mjs "<password>"  (8 characters minimum)',
  );
  process.exit(1);
}

const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64);

console.log(
  `ADMIN_PASSWORD_HASH=${salt.toString("hex")}:${hash.toString("hex")}`,
);
