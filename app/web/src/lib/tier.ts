/**
 * Tier → feature-mapping (CLAUDE.md §2, template §4.3).
 *
 * ÉN kilde til sandhed: både UI og API tjekker `harFeature()`. En Stripe-webhook
 * sætter `bryggerier.tier`, og workspacet låses op øjeblikkeligt — ingen manuel
 * provisionering. Nedgradering bevarer data, men låser features.
 */

export type Tier = "gratis" | "starter" | "pro";

export const TIERS: Tier[] = ["gratis", "starter", "pro"];

export type Feature =
  | "kort_profil" // vises på danmarkskortet, åbningstider, øl på hanen, events
  | "profil_redigering" // rediger egen offentlige profil
  | "webshop" // online bestillinger / webshop
  | "klik_og_hent"
  | "levering"
  | "salgsoverblik" // salg light
  | "lager" // lagerstyring, min.-grænser, indkøbsliste
  | "brygninger" // brygninger & gæringslog
  | "tanke"
  | "fuld_statistik"
  | "flere_brugere"; // flere brugere/roller ud over ejer

/** Mindste tier der låser hver feature op. */
const MINDSTE_TIER: Record<Feature, Tier> = {
  kort_profil: "gratis",
  profil_redigering: "gratis",
  webshop: "starter",
  klik_og_hent: "starter",
  levering: "starter",
  salgsoverblik: "starter",
  lager: "pro",
  brygninger: "pro",
  tanke: "pro",
  fuld_statistik: "pro",
  flere_brugere: "pro",
};

const RANG: Record<Tier, number> = { gratis: 0, starter: 1, pro: 2 };

export function harFeature(tier: Tier, feature: Feature): boolean {
  return RANG[tier] >= RANG[MINDSTE_TIER[feature]];
}

/** Alle features et tier giver adgang til. */
export function featuresForTier(tier: Tier): Feature[] {
  return (Object.keys(MINDSTE_TIER) as Feature[]).filter((f) => harFeature(tier, f));
}

/** Har tier'et adgang til selve workspacet (mere end kun kort-profil)? */
export function harWorkspace(tier: Tier): boolean {
  return RANG[tier] >= RANG.starter;
}

/* Pris & præsentation (til Planer-skærmen og abonnement). Beløb i øre/md. */
export const TIER_INFO: Record<Tier, { navn: string; pris_oere: number }> = {
  gratis: { navn: "På kortet", pris_oere: 0 },
  starter: { navn: "Starter", pris_oere: 14900 },
  pro: { navn: "Pro", pris_oere: 34900 },
};

export function erGyldigtTier(v: unknown): v is Tier {
  return typeof v === "string" && (TIERS as string[]).includes(v);
}
