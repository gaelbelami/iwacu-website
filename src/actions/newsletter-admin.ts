"use server";

import { getAdminClient } from "@/lib/supabase-admin";

const RESEND_API = "https://api.resend.com/emails";
const BATCH_SIZE = 100; // Resend batch limit

/**
 * Send a newsletter to all active subscribers.
 * Uses Resend (https://resend.com) — set RESEND_API_KEY and RESEND_FROM
 * (e.g. "Iwacu Collective Center <news@yourdomain.org>") in the environment.
 */
export async function sendNewsletter(subject: string, body: string): Promise<{
  success: boolean;
  sent: number;
  message: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Iwacu Collective Center <onboarding@resend.dev>";

  if (!apiKey) {
    return {
      success: false,
      sent: 0,
      message:
        "Email is not configured yet. Add RESEND_API_KEY (and ideally RESEND_FROM) to the server environment, then try again.",
    };
  }

  if (!subject?.trim() || !body?.trim()) {
    return { success: false, sent: 0, message: "Subject and message are both required." };
  }

  const admin = getAdminClient();
  const { data: subscribers, error } = await admin
    .from("newsletter_subscribers")
    .select("email")
    .is("unsubscribed_at", null);

  if (error) {
    return { success: false, sent: 0, message: `Could not load subscribers: ${error.message}` };
  }

  const emails = (subscribers || []).map((s: { email: string }) => s.email);
  if (emails.length === 0) {
    return { success: false, sent: 0, message: "No active subscribers to send to." };
  }

  let sent = 0;
  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE).map((to) => ({
      from,
      to: [to],
      subject: subject.trim(),
      // Plain-text body; Resend converts newlines cleanly.
      text: `${body.trim()}\n\n—\nIwacu Collective Center · Burundi\n`,
    }));

    const res = await fetch(RESEND_API + "/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batch),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        success: false,
        sent,
        message: `Send failed after ${sent} email(s). Resend said: ${detail.slice(0, 200)}`,
      };
    }

    sent += batch.length;
  }

  return {
    success: true,
    sent,
    message: `Newsletter sent to ${sent} subscriber${sent === 1 ? "" : "s"}.`,
  };
}
