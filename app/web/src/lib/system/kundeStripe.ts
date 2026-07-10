import Stripe from "stripe";
import { getDb } from "../db";

/**
 * TENANTENS EGEN PSP (CLAUDE.md §6.2, template §4.4-punkt-2).
 *
 * Hver tenant lægger sine EGNE Stripe-nøgler i sin config; slutkunde-betalinger
 * går til tenantens konto. Webhooken er PER-TENANT med id i URL'en
 * (`/api/payments/stripe/webhook/[bryggeriId]`), fordi webhook-secret'en skal
 * vælges *før* signaturen kan valideres. MobilePay tilbydes via Stripe.
 *
 * Holdes strengt adskilt fra platform-abonnementet (lib/stripe.ts).
 */

const NOEGLE_SECRET = "kunde_stripe_secret";
const NOEGLE_WEBHOOK = "kunde_stripe_webhook_secret";

export class KundeStripeIkkeKonfigureret extends Error {
  constructor(bryggeriId: number) {
    super(`Bryggeri ${bryggeriId} har ikke opsat egen Stripe-konto.`);
    this.name = "KundeStripeIkkeKonfigureret";
  }
}

/* Nøgler gemmes som afvigelser i bryggeri_indstillinger (ingen kode-default). */
function hentConfig(bryggeriId: number, noegle: string): string | null {
  const row = getDb()
    .prepare("SELECT vaerdi FROM bryggeri_indstillinger WHERE bryggeri_id = ? AND noegle = ?")
    .get(bryggeriId, noegle) as { vaerdi: string } | undefined;
  if (!row) return null;
  try {
    return JSON.parse(row.vaerdi) as string;
  } catch {
    return row.vaerdi;
  }
}

export function saetKundeStripeNoegler(
  bryggeriId: number,
  opts: { secret?: string; webhookSecret?: string }
): void {
  const db = getDb();
  const upsert = db.prepare(
    `INSERT INTO bryggeri_indstillinger (bryggeri_id, noegle, vaerdi) VALUES (?,?,?)
     ON CONFLICT (bryggeri_id, noegle) DO UPDATE SET vaerdi = excluded.vaerdi`
  );
  if (opts.secret !== undefined) upsert.run(bryggeriId, NOEGLE_SECRET, JSON.stringify(opts.secret));
  if (opts.webhookSecret !== undefined)
    upsert.run(bryggeriId, NOEGLE_WEBHOOK, JSON.stringify(opts.webhookSecret));
}

export function kundeStripeKonfigureret(bryggeriId: number): boolean {
  return Boolean(hentConfig(bryggeriId, NOEGLE_SECRET));
}

export function hentKundeStripe(bryggeriId: number): Stripe {
  const secret = hentConfig(bryggeriId, NOEGLE_SECRET);
  if (!secret) throw new KundeStripeIkkeKonfigureret(bryggeriId);
  return new Stripe(secret);
}

/* ── Checkout for en slutkunde-bestilling (klik & hent) ── */

export type OrdreLinje = { navn: string; antal: number; pris_oere: number };

export async function opretKundeCheckout(opts: {
  bryggeriId: number;
  bestillingId: number;
  linjer: OrdreLinje[];
  successUrl: string;
  cancelUrl: string;
  kundeEmail?: string;
}): Promise<{ url: string }> {
  const stripe = hentKundeStripe(opts.bryggeriId);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    // MobilePay + kort via tenantens egen konto (kræver DKK).
    payment_method_types: ["card", "mobilepay"],
    line_items: opts.linjer.map((l) => ({
      quantity: l.antal,
      price_data: {
        currency: "dkk",
        unit_amount: l.pris_oere,
        product_data: { name: l.navn },
      },
    })),
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    customer_email: opts.kundeEmail,
    client_reference_id: String(opts.bestillingId),
    metadata: { bryggeri_id: String(opts.bryggeriId), bestilling_id: String(opts.bestillingId) },
  });

  if (!session.url) throw new Error("Stripe returnerede ingen checkout-URL.");
  return { url: session.url };
}

/* ── Per-tenant webhook ── */

export async function haandterKundeWebhook(
  bryggeriId: number,
  rawBody: string,
  signatur: string | null
): Promise<{ handled: boolean; type?: string }> {
  const webhookSecret = hentConfig(bryggeriId, NOEGLE_WEBHOOK);
  if (!webhookSecret) throw new KundeStripeIkkeKonfigureret(bryggeriId);
  const stripe = hentKundeStripe(bryggeriId);

  const event = stripe.webhooks.constructEvent(rawBody, signatur ?? "", webhookSecret);

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const bestillingId = Number(s.metadata?.bestilling_id ?? s.client_reference_id);
    if (bestillingId) {
      getDb()
        .prepare(
          "UPDATE bestillinger SET status = 'betalt', betalings_ref = ? WHERE id = ? AND bryggeri_id = ?"
        )
        .run(typeof s.payment_intent === "string" ? s.payment_intent : s.id, bestillingId, bryggeriId);
    }
    return { handled: true, type: event.type };
  }

  return { handled: false, type: event.type };
}
