import { NextResponse } from "next/server";
import { erBruger, hentSession } from "@/lib/auth";
import { hentTenantFraSession } from "@/lib/system/tenant";
import { featuresForTier } from "@/lib/tier";
import { rettighederForRolle } from "@/lib/roller";

/** Hvem er jeg? Verificerer session-cookie og udleder tenant af sessionen. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await hentSession();
  if (!session) return NextResponse.json({ session: null }, { status: 401 });

  if (erBruger(session)) {
    const bryggeri = hentTenantFraSession(session.bryggeri_id);
    return NextResponse.json({
      session,
      bryggeri: bryggeri ? { slug: bryggeri.slug, navn: bryggeri.navn, tier: bryggeri.tier } : null,
      rettigheder: rettighederForRolle(session.rolle),
      features: bryggeri ? featuresForTier(bryggeri.tier) : [],
    });
  }

  return NextResponse.json({ session });
}
