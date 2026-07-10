/**
 * Node-only opstartslogik (kaldes kun fra instrumentation.ts i nodejs-runtime).
 * Ligger i sin egen fil, så better-sqlite3 aldrig havner i edge-bundlet
 * (middleware). Kører ved import: DB-init, admin-seed, evt. demo-seed.
 */
import { getDb } from "./lib/db";
import { seedAdmins } from "./lib/auth";

getDb(); // opret skema + kør migrationer
seedAdmins();

if (process.env.SEED_DEMO === "1" || process.env.NODE_ENV !== "production") {
  const { seedDemo } = await import("./lib/seed");
  seedDemo();
}
