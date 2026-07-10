/**
 * Tenant-roller → rettigheder (CLAUDE.md §3, skærm 07).
 *
 * - ejer:    alt inkl. indstillinger, brugere, abonnement
 * - brygger: brygninger, gæringslog, lager
 * - taproom: salg, bestillinger, events
 *
 * (Platform-admin er en separat brugertype, ikke en tenant-rolle — se lib/auth.ts.)
 */

export type Rolle = "ejer" | "brygger" | "taproom";

export const ROLLER: Rolle[] = ["ejer", "brygger", "taproom"];

export type Rettighed =
  | "indstillinger"
  | "brugere"
  | "abonnement"
  | "brygninger" // inkl. gæringslog & målinger
  | "lager"
  | "salg" // bestillinger & afhentning
  | "events";

const RETTIGHEDER: Record<Rolle, Rettighed[]> = {
  ejer: ["indstillinger", "brugere", "abonnement", "brygninger", "lager", "salg", "events"],
  brygger: ["brygninger", "lager"],
  taproom: ["salg", "events"],
};

export function harRettighed(rolle: Rolle, rettighed: Rettighed): boolean {
  return RETTIGHEDER[rolle].includes(rettighed);
}

export function rettighederForRolle(rolle: Rolle): Rettighed[] {
  return RETTIGHEDER[rolle];
}

export const ROLLE_NAVN: Record<Rolle, string> = {
  ejer: "Ejer",
  brygger: "Brygger",
  taproom: "Taproom",
};

export function erGyldigRolle(v: unknown): v is Rolle {
  return typeof v === "string" && (ROLLER as string[]).includes(v);
}
