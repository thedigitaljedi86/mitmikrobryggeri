import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { cookies } from "next/headers";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getDb } from "./db";
import type { Rolle } from "./roller";

/**
 * Auth (CLAUDE.md §3, template §2/§4.2).
 *
 * - Hjemmerullet JWT via `jose`, signeret med SESSION_SECRET.
 * - Host-only cookie (ingen domain) — deles bevidst IKKE som wildcard-cookie
 *   med subdomæner; sessionen sættes separat pr. host ved login.
 * - To brugertyper i én cookie: tenant-`bruger` og platform-`admin`.
 * - Tenant udledes i workspacet ALTID af sessionen, aldrig af URL/params.
 */

const COOKIE_NAVN = "mb_session";
const LEVETID_SEK = 60 * 60 * 24 * 30; // 30 dage

/* ─────────────────────────── Kodeord (scrypt) ─────────────────────────── */

export function hashKode(kode: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(kode, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verificerKode(kode: string, gemt: string): boolean {
  const dele = gemt.split("$");
  if (dele.length !== 3 || dele[0] !== "scrypt") return false;
  const salt = Buffer.from(dele[1], "hex");
  const forventet = Buffer.from(dele[2], "hex");
  const faktisk = scryptSync(kode, salt, forventet.length);
  return forventet.length === faktisk.length && timingSafeEqual(forventet, faktisk);
}

/* ─────────────────────────── Session-typer ─────────────────────────── */

export type BrugerSession = {
  type: "bruger";
  bruger_id: number;
  bryggeri_id: number;
  rolle: Rolle;
};

export type AdminSession = {
  type: "admin";
  admin_id: number;
  email: string;
};

export type Session = BrugerSession | AdminSession;

export function erAdmin(s: Session | null): s is AdminSession {
  return s?.type === "admin";
}
export function erBruger(s: Session | null): s is BrugerSession {
  return s?.type === "bruger";
}

/* ─────────────────────────── JWT ─────────────────────────── */

function noegle(): Uint8Array {
  const hemmelig = process.env.SESSION_SECRET;
  if (!hemmelig) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET mangler — kræves i produktion.");
    }
    // Kun til lokal udvikling; sessioner nulstilles ved genstart.
    return new TextEncoder().encode("dev-usikker-hemmelighed-skift-mig-000000");
  }
  return new TextEncoder().encode(hemmelig);
}

export async function signSession(session: Session): Promise<string> {
  return new SignJWT(session as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${LEVETID_SEK}s`)
    .sign(noegle());
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, noegle());
    if (payload.type === "admin" || payload.type === "bruger") {
      return payload as unknown as Session;
    }
    return null;
  } catch {
    return null;
  }
}

/* ─────────────────────────── Cookie-mekanik ─────────────────────────── */

export async function saetSession(session: Session): Promise<void> {
  const token = await signSession(session);
  const jar = await cookies();
  jar.set(COOKIE_NAVN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: LEVETID_SEK,
    // Bevidst INGEN `domain` → host-only cookie.
  });
}

export async function ryddSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAVN);
}

export async function hentSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAVN)?.value;
  if (!token) return null;
  return verifySession(token);
}

/* ─────────────────────────── Login ─────────────────────────── */

type BrugerRow = { id: number; bryggeri_id: number; kode_hash: string; rolle: Rolle };
type AdminRow = { id: number; kode_hash: string };

/** Tenant-login: find bruger på email, verificér kode. */
export function loginBruger(email: string, kode: string): BrugerSession | null {
  const db = getDb();
  const rows = db
    .prepare("SELECT id, bryggeri_id, kode_hash, rolle FROM brugere WHERE email = ?")
    .all(email.toLowerCase()) as BrugerRow[];
  for (const r of rows) {
    if (verificerKode(kode, r.kode_hash)) {
      return { type: "bruger", bruger_id: r.id, bryggeri_id: r.bryggeri_id, rolle: r.rolle };
    }
  }
  return null;
}

/** Admin-login mod admin_brugere. */
export function loginAdmin(email: string, kode: string): AdminSession | null {
  const db = getDb();
  const row = db
    .prepare("SELECT id, kode_hash FROM admin_brugere WHERE email = ?")
    .get(email.toLowerCase()) as AdminRow | undefined;
  if (row && verificerKode(kode, row.kode_hash)) {
    return { type: "admin", admin_id: row.id, email: email.toLowerCase() };
  }
  return null;
}

/* ─────────────────────────── Admin-seeding ─────────────────────────── */

/**
 * Seeder admins fra ADMIN_USERS (`email:kode,email:kode`) ved opstart.
 * Idempotent: eksisterende admins opdateres ikke medmindre koden mangler.
 */
export function seedAdmins(): void {
  const raw = process.env.ADMIN_USERS;
  if (!raw) return;
  const db = getDb();
  const findes = db.prepare("SELECT 1 FROM admin_brugere WHERE email = ?");
  const indsaet = db.prepare(
    "INSERT INTO admin_brugere (email, kode_hash) VALUES (?, ?)"
  );
  for (const par of raw.split(",")) {
    const [email, kode] = par.split(":");
    if (!email || !kode) continue;
    const e = email.trim().toLowerCase();
    if (findes.get(e)) continue;
    indsaet.run(e, hashKode(kode.trim()));
  }
}
