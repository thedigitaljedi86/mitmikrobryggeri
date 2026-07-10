import { getDb } from "../db";
import type { Tier } from "../tier";

/**
 * Tenant-udledning (CLAUDE.md §3–§4, template §4.1–§4.2).
 *
 * - I workspacet: tenant udledes ALTID af sessionen (`hentTenantFraSession`).
 * - På kundefladen: tenant udledes af Host-headeren (`hentTenantFraHost`),
 *   med slug-param som fallback. Denne asymmetri er en sikkerhedsgrænse.
 */

export type BryggeriStatus = "afventer_godkendelse" | "godkendt" | "afvist";

export type Bryggeri = {
  id: number;
  slug: string;
  navn: string;
  adresse: string | null;
  postnr: string | null;
  by: string | null;
  lat: number | null;
  lng: number | null;
  cvr: string | null;
  foedevare_reg: number;
  status: BryggeriStatus;
  tier: Tier;
  oprettet: string;
};

const VÆLG = `SELECT id, slug, navn, adresse, postnr, by, lat, lng, cvr,
  foedevare_reg, status, tier, oprettet FROM bryggerier`;

export function hentBryggeriViaId(id: number): Bryggeri | null {
  return (getDb().prepare(`${VÆLG} WHERE id = ?`).get(id) as Bryggeri) ?? null;
}

export function hentBryggeriViaSlug(slug: string): Bryggeri | null {
  return (getDb().prepare(`${VÆLG} WHERE slug = ?`).get(slug.toLowerCase()) as Bryggeri) ?? null;
}

/** Kun godkendte bryggerier er offentligt synlige på kortet/kundefladen. */
export function hentGodkendtViaSlug(slug: string): Bryggeri | null {
  const b = hentBryggeriViaSlug(slug);
  return b && b.status === "godkendt" ? b : null;
}

/**
 * Udled slug fra en Host-header ud fra ROOT_DOMAIN.
 * `enghave.mitbryggeri.dk` → `enghave`. Returnerer null for roddomænet selv.
 */
export function slugFraHost(host: string | null | undefined): string | null {
  if (!host) return null;
  const vaert = host.split(":")[0].toLowerCase();
  const rod = (process.env.ROOT_DOMAIN ?? "").toLowerCase();
  if (!rod || vaert === rod || vaert === `www.${rod}`) return null;
  if (vaert.endsWith(`.${rod}`)) {
    const sub = vaert.slice(0, -(rod.length + 1));
    // kun første label (enghave.mitbryggeri.dk → enghave)
    return sub.split(".")[0] || null;
  }
  return null;
}

/** Kundeflade: tenant fra Host-header, med eksplicit slug-fallback. */
export function hentTenantFraHost(host: string | null | undefined, slugFallback?: string): Bryggeri | null {
  const slug = slugFraHost(host) ?? slugFallback ?? null;
  return slug ? hentGodkendtViaSlug(slug) : null;
}

/** Workspace: tenant fra session — aldrig fra URL. */
export function hentTenantFraSession(bryggeriId: number): Bryggeri | null {
  return hentBryggeriViaId(bryggeriId);
}

/**
 * Generér en unik slug fra bryggeriets navn (kollisions-håndteret idempotent).
 * "Bryghuset Enghave" → "bryghuset-enghave", derefter "-2", "-3" ved kollision.
 */
export function genererSlug(navn: string): string {
  const grund =
    navn
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/æ/g, "ae")
      .replace(/ø/g, "oe")
      .replace(/å/g, "aa")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "bryggeri";
  const db = getDb();
  const findes = db.prepare("SELECT 1 FROM bryggerier WHERE slug = ?");
  let slug = grund;
  let n = 2;
  while (findes.get(slug)) slug = `${grund}-${n++}`;
  return slug;
}
