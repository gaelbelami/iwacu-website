"use client";

import { useState, useTransition } from "react";
import { sendNewsletter } from "@/actions/newsletter-admin";

export function NewsletterComposer({ activeCount }: { activeCount: number }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirming, setConfirming] = useState(false);

  function handleSubmit(formData: FormData) {
    const subject = formData.get("subject") as string;
    const body = formData.get("body") as string;
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      const r = await sendNewsletter(subject, body);
      setResult({ ok: r.success, text: r.message });
      setConfirming(false);
      if (r.success) {
        (document.getElementById("newsletter-form") as HTMLFormElement)?.reset();
      }
    });
  }

  return (
    <div className="bg-white rounded-xl border border-[#2E3D2E]/10 p-6 mb-8">
      <h2 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E] mb-1">
        Send a newsletter
      </h2>
      <p className="text-sm text-[#2E3D2E]/60 mb-4">
        Goes to all {activeCount} active subscriber{activeCount === 1 ? "" : "s"}. Plain text, sent from your
        configured sender. Requires RESEND_API_KEY in the environment.
      </p>

      {result && (
        <div
          className={`mb-4 px-4 py-2.5 rounded-lg text-sm ${
            result.ok ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
          }`}
        >
          {result.text}
        </div>
      )}

      <form id="newsletter-form" action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Subject</label>
          <input
            name="subject"
            required
            placeholder="News from Iwacu — October 2026"
            className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Message</label>
          <textarea
            name="body"
            required
            rows={8}
            placeholder={"Dear friends,\n\nHere is what has happened this month at Iwacu…"}
            className="w-full px-4 py-3 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-y"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending || activeCount === 0}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 ${
              confirming
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-[#2E3D2E] text-[#EFE9DA] hover:bg-[#2E3D2E]/90"
            }`}
          >
            {isPending
              ? "Sending..."
              : confirming
              ? `Really send to ${activeCount} subscriber${activeCount === 1 ? "" : "s"}? Click again`
              : "Send newsletter"}
          </button>
        </div>
      </form>
    </div>
  );
}
