"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/services/newsletter";

export default function NewsletterForm({
  placeholder,
  buttonText,
}: {
  placeholder: string;
  buttonText: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const result = await subscribeNewsletter(email);

    if (result.success) {
      setStatus("success");
      setMessage(result.message);
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-full border border-accent bg-accent/10 py-4 px-6 text-center font-display text-sm font-medium text-accent">
        {message}
      </div>
    );
  }

  return (
    <form
      className="flex rounded-full border border-rule-on-green bg-forest-deep py-1.5 pl-6 pr-1.5"
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className="flex-1 border-none bg-transparent py-3.5 font-body text-[15px] text-oatmeal outline-none placeholder:text-oatmeal/50"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full bg-accent px-[22px] py-3.5 font-display text-sm font-semibold text-ink disabled:opacity-60"
      >
        {status === "loading" ? "…" : buttonText}
      </button>
    </form>
  );
}
