import { NextResponse } from "next/server";
import { loginAdmin, loginBruger, saetSession } from "@/lib/auth";

/**
 * Login for begge brugertyper. Body: { email, kode, konto?: "bruger" | "admin" }.
 * Sætter host-only session-cookie ved succes.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { email?: string; kode?: string; konto?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ fejl: "Ugyldig JSON" }, { status: 400 });
  }

  const { email, kode, konto = "bruger" } = body;
  if (!email || !kode) {
    return NextResponse.json({ fejl: "Email og kode kræves" }, { status: 400 });
  }

  const session = konto === "admin" ? loginAdmin(email, kode) : loginBruger(email, kode);
  if (!session) {
    return NextResponse.json({ fejl: "Forkert email eller kode" }, { status: 401 });
  }

  await saetSession(session);
  return NextResponse.json({ ok: true, session });
}
