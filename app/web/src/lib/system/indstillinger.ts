import { getDb } from "../db";

/**
 * Per-tenant konfiguration som nøgle/værdi med DEFAULTS I KODE (template §4.5).
 *
 * Ingen seed-rækker pr. tenant: en ny tenant "arver" alle defaults gratis;
 * kun afvigelser gemmes i `bryggeri_indstillinger`. Værdier serialiseres som JSON.
 */

export type Aabningstid = { dag: string; fra: string | null; til: string | null };

export type Indstillinger = {
  webshop_aktiv: boolean;
  klik_og_hent: boolean;
  levering: boolean;
  notifikation_maaling: boolean;
  notifikation_lavt_lager: boolean;
  notifikation_ny_bestilling: boolean;
  auto_indkoebsliste: boolean;
  traek_lager_ved_brygstart: boolean;
  moms_pct: number;
  aabningstider: Aabningstid[];
};

/** Defaults afledt af designet (skærm 08–11). */
export const INDSTILLING_DEFAULTS: Indstillinger = {
  webshop_aktiv: true,
  klik_og_hent: true,
  levering: false,
  notifikation_maaling: true,
  notifikation_lavt_lager: true,
  notifikation_ny_bestilling: false,
  auto_indkoebsliste: true,
  traek_lager_ved_brygstart: false,
  moms_pct: 25,
  aabningstider: [
    { dag: "torsdag", fra: "16", til: "21" },
    { dag: "fredag", fra: "14", til: "22" },
    { dag: "lørdag", fra: "12", til: "22" },
    { dag: "søndag", fra: null, til: null },
    { dag: "mandag", fra: null, til: null },
    { dag: "tirsdag", fra: null, til: null },
    { dag: "onsdag", fra: null, til: null },
  ],
};

export type IndstillingNoegle = keyof Indstillinger;

/** Hent én indstilling — afvigelse fra DB, ellers default fra kode. */
export function hentIndstilling<K extends IndstillingNoegle>(
  bryggeriId: number,
  noegle: K
): Indstillinger[K] {
  const row = getDb()
    .prepare("SELECT vaerdi FROM bryggeri_indstillinger WHERE bryggeri_id = ? AND noegle = ?")
    .get(bryggeriId, noegle) as { vaerdi: string } | undefined;
  if (!row) return INDSTILLING_DEFAULTS[noegle];
  try {
    return JSON.parse(row.vaerdi) as Indstillinger[K];
  } catch {
    return INDSTILLING_DEFAULTS[noegle];
  }
}

/** Hent alle indstillinger (defaults flettet med gemte afvigelser). */
export function hentAlleIndstillinger(bryggeriId: number): Indstillinger {
  const rows = getDb()
    .prepare("SELECT noegle, vaerdi FROM bryggeri_indstillinger WHERE bryggeri_id = ?")
    .all(bryggeriId) as { noegle: string; vaerdi: string }[];
  const resultat: Indstillinger = { ...INDSTILLING_DEFAULTS };
  for (const r of rows) {
    if (r.noegle in resultat) {
      try {
        (resultat as Record<string, unknown>)[r.noegle] = JSON.parse(r.vaerdi);
      } catch {
        /* behold default ved ugyldig JSON */
      }
    }
  }
  return resultat;
}

/** Gem en afvigelse (upsert). */
export function saetIndstilling<K extends IndstillingNoegle>(
  bryggeriId: number,
  noegle: K,
  vaerdi: Indstillinger[K]
): void {
  getDb()
    .prepare(
      `INSERT INTO bryggeri_indstillinger (bryggeri_id, noegle, vaerdi) VALUES (?, ?, ?)
       ON CONFLICT (bryggeri_id, noegle) DO UPDATE SET vaerdi = excluded.vaerdi`
    )
    .run(bryggeriId, noegle, JSON.stringify(vaerdi));
}

/** Nulstil en indstilling til kode-default (fjern afvigelsen). */
export function nulstilIndstilling(bryggeriId: number, noegle: IndstillingNoegle): void {
  getDb()
    .prepare("DELETE FROM bryggeri_indstillinger WHERE bryggeri_id = ? AND noegle = ?")
    .run(bryggeriId, noegle);
}
