import { getTranslations } from "next-intl/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { getDonateSettings } from "@/services/donate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "donatePage" });
  return {
    title: t("eyebrow"),
    description: t("description"),
  };
}

export default async function DonatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("donatePage");
  const s = await getDonateSettings(locale as "en" | "fr");

  const pct =
    s.goal > 0 ? Math.min(100, Math.round((s.raised / s.goal) * 100)) : 0;
  const fmt = (n: number) =>
    n.toLocaleString(locale === "fr" ? "fr-FR" : "en-US", {
      style: "currency",
      currency: s.currency || "USD",
      maximumFractionDigits: 0,
    });

  const mobile = s.mobileText[locale as "en" | "fr"] || s.mobileText.en;
  const bank = s.bankText[locale as "en" | "fr"] || s.bankText.en;

  return (
    <main className="bg-oatmeal text-ink">
      <Nav variant="light" />

      {/* ── Header ─────────────────────────── */}
      <section className="border-b border-rule pb-12 pt-20 md:pt-24">
        <div className="container-iwacu">
          <div className="mb-7 font-display text-xs uppercase tracking-[0.14em] text-forest/70">
            <span>{t("eyebrow")}</span>
          </div>
          <h1 className="max-w-[16ch] font-display text-[clamp(48px,7vw,110px)] font-medium leading-[0.95] tracking-[-0.035em] text-forest">
            {t("heading")}{" "}
            <em className="font-serif italic font-normal text-forest-soft">
              {t("headingItalic")}
            </em>
          </h1>
          <p className="mt-8 max-w-[52ch] text-[19px] leading-[1.55] text-ink-soft">
            {t("description")}
          </p>
        </div>
      </section>

      {/* ── Funding progress ───────────────── */}
      {s.goal > 0 && (
        <section className="border-b border-rule bg-forest py-16 text-oatmeal">
          <div className="container-iwacu">
            <span className="font-display text-xs font-medium uppercase tracking-[0.14em] text-accent">
              {t("progressEyebrow")}
            </span>
            <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="font-display text-[clamp(40px,6vw,80px)] font-medium leading-none tracking-[-0.03em]">
                {fmt(s.raised)}
              </span>
              <span className="font-display text-lg text-oatmeal/70">
                {t("progressOf")} {fmt(s.goal)} {t("progressGoal")}
              </span>
            </div>
            <div
              className="mt-8 h-3 w-full overflow-hidden rounded-full bg-oatmeal/15"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t("progressEyebrow")}
            >
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-4 font-display text-[13px] tracking-[0.06em] text-oatmeal/60">
              {pct}% · {t("progressNote")}
            </p>
          </div>
        </section>
      )}

      {/* ── Ways to give ───────────────────── */}
      <section className="py-20">
        <div className="container-iwacu">
          <h2 className="mb-12 border-b border-rule pb-5 font-display text-sm font-medium uppercase tracking-[0.14em] text-forest-soft">
            {t("waysHeading")}
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Card */}
            <div className="flex flex-col gap-4 rounded-lg border border-rule bg-cream p-8">
              <span className="w-fit rounded-full bg-forest px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
                {s.stripeUrl ? t("cardTitle") : t("comingSoon")}
              </span>
              <h3 className="font-display text-2xl font-medium text-forest">
                {t("cardTitle")}
              </h3>
              <p className="text-sm leading-[1.6] text-ink-soft">{t("cardDesc")}</p>
              {s.stripeUrl ? (
                <a
                  href={s.stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex w-fit items-center rounded-full border-[1.5px] border-forest px-6 py-3 font-display text-sm font-medium text-forest transition-all hover:bg-forest hover:text-oatmeal"
                >
                  {t("cardCta")} →
                </a>
              ) : (
                <span className="mt-auto font-display text-[13px] tracking-[0.06em] text-forest-soft/60">
                  — {t("comingSoon")}
                </span>
              )}
            </div>

            {/* Mobile money */}
            <div className="flex flex-col gap-4 rounded-lg border border-rule bg-cream p-8">
              <span className="w-fit rounded-full bg-forest px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
                {mobile ? t("mobileTitle") : t("comingSoon")}
              </span>
              <h3 className="font-display text-2xl font-medium text-forest">
                {t("mobileTitle")}
              </h3>
              <p className="text-sm leading-[1.6] text-ink-soft">
                {mobile || t("mobileDesc")}
              </p>
            </div>

            {/* Bank transfer */}
            <div className="flex flex-col gap-4 rounded-lg border border-rule bg-cream p-8">
              <span className="w-fit rounded-full bg-forest px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.1em] text-accent">
                {bank ? t("bankTitle") : t("comingSoon")}
              </span>
              <h3 className="font-display text-2xl font-medium text-forest">
                {t("bankTitle")}
              </h3>
              <p className="whitespace-pre-line text-sm leading-[1.6] text-ink-soft">
                {bank || t("bankDesc")}
              </p>
            </div>
          </div>

          {/* Contact fallback */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-lg bg-forest px-8 py-10 text-oatmeal">
            <div>
              <h3 className="font-display text-2xl font-medium">{t("contactTitle")}</h3>
              <p className="mt-2 max-w-[52ch] text-sm text-oatmeal/75">{t("contactDesc")}</p>
            </div>
            {s.email && (
              <a
                href={`mailto:${s.email}?subject=${encodeURIComponent("Donation — Iwacu Collective Center")}`}
                className="inline-flex items-center rounded-full bg-accent px-7 py-3.5 font-display text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                {t("contactCta")} →
              </a>
            )}
          </div>

          <p className="mt-10 max-w-[68ch] font-display text-[13px] leading-[1.6] tracking-[0.04em] text-forest-soft/70">
            {t("receiptNote")}
          </p>
        </div>
      </section>

      <Footer variant="light" />
    </main>
  );
}
