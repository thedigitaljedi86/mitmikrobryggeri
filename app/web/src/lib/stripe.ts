import Stripe from "stripe";
import { getDb } from "./db";
import { erGyldigtTier, type Tier } from "./tier";

/**
 * PLATFORMENS abonnement (CLAUDE.md §6.1, template §4.4-punkt-1).
 *
 * Platformens egen Stripe-konto, én webhook. Sådan tjener *platformen* penge.
 * Holdes strengt adskilt fra tenantens egen PSP (lib/system/kundeStripe.ts).
 *
 * Betaling låser workspacet op øjeblikkeligt (tier sættes af webhooken);
 * admin-godkendelse er en SEPARAT gate der kun styrer kort-synlighed.
 */

export class StripeIkkeKonfigureret extends Error {
  constructor() {
    super("Stripe er ikke konfigureret (STRIPE_SECRET_KEY mangler).");
    this.name = "StripeIkkeKonfigureret";
  }
}

export function stripeKonfigureret(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

let klient: Stripe | null = null;
export function hentStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) throw new StripeIkkeKonfigureret();
  if (!klient) klient = new Stripe(process.env.STRIPE_SECRET_KEY);
  return klient;
}

/* ── Tier ↔ Stripe pris-id ── */

export function prisIdForTier(tier: Tier): string | null {
  if (tier === "starter") return process.env.STRIPE_PRICE_STARTER ?? null;
  if (tier === "pro") return process.env.STRIPE_PRICE_PRO ?? null;
  return null; // gratis har ingen pris
}

function tierForPrisId(prisId: string | undefined): Tier | null {
  if (!prisId) return null;
  if (prisId === process.env.STRIPE_PRICE_STARTER) return "starter";
  if (prisId === process.env.STRIPE_PRICE_PRO) return "pro";
  return null;
}

/* ── Checkout (opgradér tier) ── */

export async function opretAbonnementCheckout(opts: {
  bryggeriId: number;
  tier: Exclude<Tier, "gratis">;
  successUrl: string;
  cancelUrl: string;
  kundeEmail?: string;
}): Promise<{ url: string }> {
  const stripe = hentStripe();
  const pris = prisIdForTier(opts.tier);
  if (!pris) throw new Error(`Ingen Stripe-pris konfigureret for tier '${opts.tier}'.`);

  const metadata = { bryggeri_id: String(opts.bryggeriId), tier: opts.tier };
  const eksisterendeKunde = hentStripeCustomerId(opts.bryggeriId);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: pris, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    customer: eksisterendeKunde ?? undefined,
    customer_email: eksisterendeKunde ? undefined : opts.kundeEmail,
    client_reference_id: String(opts.bryggeriId),
    metadata,
    subscription_data: { metadata },
  });

  if (!session.url) throw new Error("Stripe returnerede ingen checkout-URL.");
  return { url: session.url };
}

/* ── Webhook → tier ── */

export async function haandterPlatformWebhook(
  rawBody: string,
  signatur: string | null
): Promise<{ handled: boolean; type?: string }> {
  const hemmelig = process.env.STRIPE_WEBHOOK_SECRET;
  if (!hemmelig) throw new StripeIkkeKonfigureret();
  const stripe = hentStripe();

  const event = stripe.webhooks.constructEvent(rawBody, signatur ?? "", hemmelig);

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      const bryggeriId = Number(s.metadata?.bryggeri_id ?? s.client_reference_id);
      const tier = s.metadata?.tier;
      if (bryggeriId && erGyldigtTier(tier)) {
        saetTierFraStripe(bryggeriId, tier, {
          customerId: typeof s.customer === "string" ? s.customer : undefined,
          subscriptionId: typeof s.subscription === "string" ? s.subscription : undefined,
          status: "active",
        });
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      const bryggeriId = Number(sub.metadata?.bryggeri_id);
      const tier = tierForPrisId(sub.items.data[0]?.price?.id);
      if (bryggeriId && tier) {
        saetTierFraStripe(bryggeriId, tier, {
          subscriptionId: sub.id,
          status: sub.status,
        });
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const bryggeriId = Number(sub.metadata?.bryggeri_id);
      if (bryggeriId) {
        // Nedgradér til gratis — data bevares, features låses.
        saetTierFraStripe(bryggeriId, "gratis", { status: "canceled" });
      }
      break;
    }
    default:
      return { handled: false, type: event.type };
  }
  return { handled: true, type: event.type };
}

/* ── DB-hjælpere ── */

function hentStripeCustomerId(bryggeriId: number): string | null {
  const row = getDb()
    .prepare("SELECT stripe_customer_id FROM bryggerier WHERE id = ?")
    .get(bryggeriId) as { stripe_customer_id: string | null } | undefined;
  return row?.stripe_customer_id ?? null;
}

export function saetTierFraStripe(
  bryggeriId: number,
  tier: Tier,
  info: { customerId?: string; subscriptionId?: string; status?: string } = {}
): void {
  const db = getDb();
  db.prepare(
    `UPDATE bryggerier SET
       tier = ?,
       stripe_customer_id = COALESCE(?, stripe_customer_id),
       stripe_subscription_id = COALESCE(?, stripe_subscription_id),
       stripe_status = COALESCE(?, stripe_status)
     WHERE id = ?`
  ).run(tier, info.customerId ?? null, info.subscriptionId ?? null, info.status ?? null, bryggeriId);
}
