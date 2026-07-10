import { NextResponse } from "next/server";
import { haandterPlatformWebhook, StripeIkkeKonfigureret } from "@/lib/stripe";

/**
 * PLATFORMENS Stripe-webhook (§6.1). Sætter bryggeriets tier.
 * Kræver rå body til signaturvalidering (`req.text()`).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signatur = req.headers.get("stripe-signature");
  try {
    const resultat = await haandterPlatformWebhook(rawBody, signatur);
    return NextResponse.json({ received: true, ...resultat });
  } catch (e) {
    if (e instanceof StripeIkkeKonfigureret) {
      return NextResponse.json({ fejl: e.message }, { status: 503 });
    }
    // Signaturfejl m.m. → 400 så Stripe prøver igen.
    const besked = e instanceof Error ? e.message : "Webhook-fejl";
    return NextResponse.json({ fejl: besked }, { status: 400 });
  }
}
