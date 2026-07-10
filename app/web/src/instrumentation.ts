/**
 * Opstarts-hook (Next.js instrumentation). Node-only init lægges i en separat
 * modul der KUN importeres i nodejs-runtime, så better-sqlite3 holdes ude af
 * edge-bundlet (middleware). Springes over under build.
 */
export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NEXT_PHASE !== "phase-production-build"
  ) {
    await import("./instrumentation-node");
  }
}
