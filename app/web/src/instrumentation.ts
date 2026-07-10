/**
 * Opstarts-hook (Next.js instrumentation). Kører én gang når serveren booter:
 * forbereder DB'en (skema + migrationer via getDb), seeder admins fra ADMIN_USERS
 * og — hvis SEED_DEMO=1 eller i udvikling — indlæser demo-data.
 *
 * Springes over under build og i edge-runtime.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  const { getDb } = await import("./lib/db");
  const { seedAdmins } = await import("./lib/auth");

  getDb(); // opret skema + kør migrationer
  seedAdmins();

  if (process.env.SEED_DEMO === "1" || process.env.NODE_ENV !== "production") {
    const { seedDemo } = await import("./lib/seed");
    seedDemo();
  }
}
