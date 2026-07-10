import { NextResponse } from "next/server";
import { ryddSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  await ryddSession();
  return NextResponse.json({ ok: true });
}
