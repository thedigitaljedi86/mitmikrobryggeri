import { NextResponse } from "next/server";
import { haandterKundeWebhook, KundeStripeIkkeKonfigureret } from "@/lib/system/kundeStripe";

/**
 * TENANTENS EGEN Stripe-webhook (§6.2). Per-tenant med id i URL'en, fordi
 * webhook-secret'en skal vælges FØR signaturen kan valideres. Markerer
 * bestillinger som betalt på tenantens konto.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ bryggeriId: string }> }
) {
  const { bryggeriId } = await ctx.params;
  const id = Number(bryggeriId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ fejl: "Ugyldigt bryggeri-id" }, { status: 400 });
  }

  const rawBody = await req.text();
  const signatur = req.headers.get("stripe-signature");
  try {
    const resultat = await haandterKundeWebhook(id, rawBody, signatur);
    return NextResponse.json({ received: true, ...resultat });
  } catch (e) {
    if (e instanceof KundeStripeIkkeKonfigureret) {
      return NextResponse.json({ fejl: e.message }, { status: 503 });
    }
    const besked = e instanceof Error ? e.message : "Webhook-fejl";
    return NextResponse.json({ fejl: besked }, { status: 400 });
  }
}
