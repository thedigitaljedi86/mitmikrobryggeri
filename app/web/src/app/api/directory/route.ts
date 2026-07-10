import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * Offentligt directory (template §4.6): kun GODKENDTE bryggerier vises på kortet.
 * Betaling og godkendelse er adskilte gates — dette endpoint gater kun synlighed.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = {
  id: number;
  slug: string;
  navn: string;
  by: string | null;
  lat: number | null;
  lng: number | null;
  tier: string;
  paa_hanen: number;
};

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT b.id, b.slug, b.navn, b.by, b.lat, b.lng, b.tier,
              (SELECT COUNT(*) FROM oel o WHERE o.bryggeri_id = b.id AND o.paa_hanen = 1) AS paa_hanen
       FROM bryggerier b
       WHERE b.status = 'godkendt'
       ORDER BY b.navn`
    )
    .all() as Row[];

  return NextResponse.json({
    antal: rows.length,
    bryggerier: rows.map((r) => ({
      slug: r.slug,
      navn: r.navn,
      by: r.by,
      koordinater: r.lat != null && r.lng != null ? { lat: r.lat, lng: r.lng } : null,
      tier: r.tier,
      oel_paa_hanen: r.paa_hanen,
    })),
  });
}
