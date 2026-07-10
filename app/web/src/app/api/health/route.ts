import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const { antal } = db.prepare("SELECT COUNT(*) AS antal FROM bryggerier").get() as { antal: number };
  return NextResponse.json({ ok: true, bryggerier: antal });
}
