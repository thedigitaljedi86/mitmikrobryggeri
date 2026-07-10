import { NextResponse } from "next/server";
import { erBruger, hentSession } from "@/lib/auth";
import { harRettighed } from "@/lib/roller";
import { opretAbonnementCheckout, stripeKonfigureret, StripeIkkeKonfigureret } from "@/lib/stripe";

/**
 * Start platform-abonnement-checkout for det indloggede bryggeri.
 * Kræver rollen 'ejer' (rettighed: abonnement). Tenant udledes af sessionen.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await hentSession();
  if (!erBruger(session)) {
    return NextResponse.json({ fejl: "Log ind kræves" }, { status: 401 });
  }
  if (!harRettighed(session.rolle, "abonnement")) {
    return NextResponse.json({ fejl: "Kun ejeren kan ændre abonnement" }, { status: 403 });
  }
  if (!stripeKonfigureret()) {
    return NextResponse.json({ fejl: "Stripe er ikke konfigureret" }, { status: 503 });
  }

  let body: { tier?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ fejl: "Ugyldig JSON" }, { status: 400 });
  }
  if (body.tier !== "starter" && body.tier !== "pro") {
    return NextResponse.json({ fejl: "tier skal være 'starter' eller 'pro'" }, { status: 400 });
  }

  const base = process.env.PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const { url } = await opretAbonnementCheckout({
      bryggeriId: session.bryggeri_id,
      tier: body.tier,
      successUrl: `${base}/system/indstillinger?betaling=ok`,
      cancelUrl: `${base}/system/indstillinger?betaling=afbrudt`,
    });
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    if (e instanceof StripeIkkeKonfigureret) {
      return NextResponse.json({ fejl: e.message }, { status: 503 });
    }
    throw e;
  }
}
