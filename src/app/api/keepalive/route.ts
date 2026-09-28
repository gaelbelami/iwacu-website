import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/**
 * Keepalive endpoint — Vercel Cron hits this daily (see vercel.json).
 * Any Supabase query resets the free-tier 7-day inactivity timer.
 * If CRON_SECRET is set, requests must present it (Vercel sends it automatically).
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ ok: false, reason: "Supabase not configured" }, { status: 200 });
  }

  const { error } = await supabase
    .from("stories")
    .select("id", { count: "exact", head: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
