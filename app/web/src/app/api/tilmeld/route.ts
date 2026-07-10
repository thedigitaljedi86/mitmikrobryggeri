import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { hashKode, saetSession } from "@/lib/auth";
import { genererSlug } from "@/lib/system/tenant";

/**
 * Tilmelding af nyt bryggeri (template §4.6).
 * Status = 'afventer_godkendelse' → admin gater directory-synlighed.
 * Betaling (Stripe) er en SEPARAT gate der låser workspacet op — ikke her.
 * Opretter ejer-brugeren og logger vedkommende ind.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  bryggeri_navn?: string;
  adresse?: string;
  postnr?: string;
  by?: string;
  cvr?: string;
  ejer_navn?: string;
  email?: string;
  kode?: string;
};

export async function POST(req: Request) {
  let b: Body;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ fejl: "Ugyldig JSON" }, { status: 400 });
  }

  const navn = b.bryggeri_navn?.trim();
  const ejerNavn = b.ejer_navn?.trim();
  const email = b.email?.trim().toLowerCase();
  const kode = b.kode;
  if (!navn || !ejerNavn || !email || !kode) {
    return NextResponse.json(
      { fejl: "bryggeri_navn, ejer_navn, email og kode kræves" },
      { status: 400 }
    );
  }
  if (kode.length < 8) {
    return NextResponse.json({ fejl: "Koden skal være mindst 8 tegn" }, { status: 400 });
  }

  const db = getDb();
  const slug = genererSlug(navn);

  const opret = db.transaction(() => {
    const bryggeriId = Number(
      db
        .prepare(
          `INSERT INTO bryggerier (slug, navn, adresse, postnr, by, cvr, status, tier)
           VALUES (?,?,?,?,?,?, 'afventer_godkendelse', 'gratis')`
        )
        .run(slug, navn, b.adresse ?? null, b.postnr ?? null, b.by ?? null, b.cvr ?? null)
        .lastInsertRowid
    );
    db.prepare(
      "INSERT INTO brugere (bryggeri_id, navn, email, kode_hash, rolle) VALUES (?,?,?,?, 'ejer')"
    ).run(bryggeriId, ejerNavn, email, hashKode(kode));
    return bryggeriId;
  });

  let bryggeriId: number;
  try {
    bryggeriId = opret();
  } catch (e) {
    const besked = e instanceof Error ? e.message : String(e);
    if (/UNIQUE/.test(besked)) {
      return NextResponse.json({ fejl: "Email er allerede i brug" }, { status: 409 });
    }
    throw e;
  }

  const ejerId = Number(
    (db.prepare("SELECT id FROM brugere WHERE bryggeri_id = ? AND email = ?").get(bryggeriId, email) as { id: number }).id
  );
  await saetSession({ type: "bruger", bruger_id: ejerId, bryggeri_id: bryggeriId, rolle: "ejer" });

  return NextResponse.json({
    ok: true,
    slug,
    status: "afventer_godkendelse",
    besked: "Bryggeriet er oprettet og afventer godkendelse til kortet. Workspacet er tilgængeligt.",
  });
}
