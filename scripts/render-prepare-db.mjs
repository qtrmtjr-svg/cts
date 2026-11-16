/**
 * Render: persistent disks mount at RUNTIME only (not during build).
 * Run this before `next start` so SQLite lives on /var/data/stc.db.
 */
import { mkdirSync } from "node:fs";
import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL ?? "";

if (url.startsWith("file:/var/data") || url.includes("/var/data/")) {
  mkdirSync("/var/data", { recursive: true });
  console.log("[render] Using persistent SQLite:", url);
} else if (url.startsWith("file:./") || url.includes("dev.db")) {
  console.warn(
    "[render] WARNING: DATABASE_URL points at a local file inside the container.",
    "Data will be LOST on every deploy. Set DATABASE_URL=file:/var/data/stc.db and attach a Persistent Disk at /var/data.",
  );
}

execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
execSync("node scripts/ensure-bootstrap.mjs", { stdio: "inherit" });
