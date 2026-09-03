import { getTranslations } from "next-intl/server";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import { getActiveTeamMembers } from "@/services/team";
import { getLocale } from "next-intl/server";

export default async function AboutPage() {
  const t = await getTranslations("about");
  const locale = (await getLocale()) as "en" | "fr";
  const teamFromDb = await getActiveTeamMembers(locale);

  const facts = [
    { key: t("factKey1"), value: t("factVal1") },
    { key: t("factKey2"), value: t("factVal2") },
    { key: t("factKey3"), value: t("factVal3") },
    { key: t("factKey4"), value: t("factVal4") },
  ];

  // Five real values from the founding vision document (Dignity & Respect,
  // Integrity & Confidentiality, Empathy, Empowerment, Solidarity)
  const values = [
    { number: "01", title: t("val1Title"), text: t("val1Text") },
    { number: "02", title: t("val2Title"), text: t("val2Text") },
    { number: "03", title: t("val3Title"), text: t("val3Text") },
    { number: "04", title: t("val4Title"), text: t("val4Text") },
    { number: "05", title: t("val5Title"), text: t("val5Text") },
  ];

  // Team members come exclusively from Supabase (managed via the admin panel).
  // No fictional fallback — the section is hidden until real members exist.
  const members = teamFromDb ?? [];

  // Timeline is hidden for now: the organization is in formation and real
  // milestones will be added via Supabase/admin once they exist.
  // const timelineItems = [
  //   { year: "2018", title: t("tl1Title"), desc: t("tl1Desc") },
  //   { year: "2019", title: t("tl2Title"), desc: t("tl2Desc") },
  //   { year: "2020", title: t("tl3Title"), desc: t("tl3Desc") },
  //   { year: "2022", title: t("tl4Title"), desc: t("tl4Desc") },
  //   { year: "2024", title: t("tl5Title"), desc: t("tl5Desc") },
  //   { year: "2026", title: t("tl6Title"), desc: t("tl6Desc") },
  // ];

  return (
    <main className="bg-oatmeal text-ink">
      <Nav variant="light" />

      {/* ── Hero ─────────────────────────────── */}
      <section className="border-b border-rule pb-20 pt-24 md:pt-28">
        <div className="container-iwacu">
          <div className="mb-10 flex items-center gap-3.5 text-forest">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="eyebrow font-display text-xs font-medium uppercase tracking-[0.14em]">
              {t("heroEyebrow")}
            </span>
          </div>
          <h1 className="max-w-[14ch] font-display text-[clamp(48px,8vw,128px)] font-medium leading-[0.94] tracking-[-0.035em] text-forest">
            {t("heroHeading")}
            <br />
            <em className="font-serif italic font-normal text-forest-soft">
              {t("heroHeadingItalic")}
            </em>
          </h1>

          <div className="mt-10 grid grid-cols-1 gap-15 md:grid-cols-2 md:gap-15">
            <p className="max-w-[46ch] text-xl leading-[1.55] text-ink-soft">
              {t("heroDescription")}
            </p>
            <div className="flex flex-col gap-3 font-display text-[13px] tracking-[0.06em] text-forest md:self-end">
              {facts.map((fact, i) => (
                <div
                  key={i}
                  className="flex justify-between border-b border-rule py-2"
                >
                  <span className="text-[11px] uppercase tracking-[0.1em] text-forest/60">
                    {fact.key}
                  </span>
                  <span>{fact.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Portrait ─────────────────────────── */}
      <section className="py-15">
        <div className="container-iwacu">
          <div className="aspect-[21/9] w-full overflow-hidden rounded-md bg-forest text-oatmeal">
            <ImageSlot placeholder={t("portraitPlaceholder")} />
          </div>
          <div className="mt-4 flex justify-between font-display text-xs uppercase tracking-[0.1em] text-forest-soft">
            <span>{t("portraitCaptionLeft")}</span>
            <span>{t("portraitCaptionRight")}</span>
          </div>
        </div>
      </section>

      {/* ── Our Story (long-form editorial) ──── */}
      <section className="bg-cream py-24 md:py-28">
        <div className="container-iwacu mx-auto grid max-w-[1100px] grid-cols-1 gap-15 md:grid-cols-[240px_1fr] md:gap-20">
          <aside className="flex flex-col gap-5 md:sticky md:top-[100px] md:h-fit">
            <span className="font-display text-xs font-medium uppercase tracking-[0.14em] text-forest-soft">
              {t("storyEyebrow")}
            </span>
            <h3 className="font-display text-2xl font-medium leading-[1.1] tracking-[-0.015em] text-forest">
              {t("storySidebarHeading")}
            </h3>
          </aside>

          <div className="max-w-[62ch]">
            <p className="mb-6 text-lg leading-[1.65] text-ink first-letter:float-left first-letter:pr-3 first-letter:pt-1 first-letter:font-serif first-letter:text-[4em] first-letter:leading-[0.85] first-letter:text-forest">
              {t("storyP1")}
            </p>
            <p className="mb-6 text-lg leading-[1.65] text-ink">
              {t("storyP2")}
            </p>

            <h3 className="mb-4 mt-10 font-display text-[26px] font-medium tracking-[-0.015em] text-forest">
              {t("beliefHeading")}
            </h3>
            <p className="mb-6 text-lg leading-[1.65] text-ink">
              {t("beliefP1")}
            </p>
            <p className="mb-6 text-lg leading-[1.65] text-ink">
              {t("beliefP2")}
            </p>

            <blockquote className="my-10 border-y border-rule py-10 font-serif text-[26px] italic leading-[1.35] text-forest max-w-[44ch]">
              {t("blockquote")}
              <cite className="mt-5 block font-display text-xs not-italic uppercase tracking-[0.14em] text-forest-soft">
                {t("blockquoteCite")}
              </cite>
            </blockquote>

            <h3 className="mb-4 mt-10 font-display text-[26px] font-medium tracking-[-0.015em] text-forest">
              {t("notDoHeading")}
            </h3>
            <p className="mb-6 text-lg leading-[1.65] text-ink">
              {t("notDoP1")}
            </p>
            <p className="mb-6 text-lg leading-[1.65] text-ink">
              {t("notDoP2")}
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────── */}
      <section className="bg-forest py-28 text-oatmeal md:py-32">
        <div className="container-iwacu">
          <div className="mb-20 grid grid-cols-1 items-end gap-15 md:grid-cols-[1fr_1.4fr]">
            <h2 className="font-display text-[clamp(40px,5vw,72px)] font-medium leading-none tracking-[-0.03em]">
              {t("valuesHeading")}
            </h2>
            <p className="max-w-[52ch] text-lg leading-[1.55] text-oatmeal/82">
              {t("valuesDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px border-y border-rule-on-green bg-rule-on-green md:grid-cols-2">
            {values.map((v, i) => (
              <div
                key={i}
                className="flex min-h-[260px] flex-col gap-5 bg-forest p-8 md:p-10"
              >
                <span className="font-display text-[13px] tracking-[0.14em] text-accent/90">
                  {v.number}
                </span>
                <h3 className="font-display text-2xl font-medium leading-[1.15] tracking-[-0.015em]">
                  {v.title}
                </h3>
                <p className="max-w-[40ch] text-[15px] leading-[1.6] text-oatmeal/78">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team (only when real members exist in Supabase) ── */}
      {members.length > 0 && (
      <section className="py-28 md:py-32">
        <div className="container-iwacu">
          <div className="mb-15 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
            <div>
              <span className="font-display text-xs font-medium uppercase tracking-[0.14em] text-forest-soft">
                {t("teamEyebrow")}
              </span>
              <h2 className="mt-3 font-display text-[clamp(40px,5vw,72px)] font-medium leading-none tracking-[-0.03em] text-forest">
                {t("teamHeading")}
              </h2>
            </div>
            <p className="max-w-[32ch] text-[15px] text-ink-soft">
              {t("teamDescription")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {members.map((member, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded bg-forest text-oatmeal">
                  <ImageSlot placeholder={member.imagePlaceholder} />
                </div>
                <h4 className="mt-2 font-display text-lg font-medium tracking-[-0.01em] text-forest">
                  {member.name}
                </h4>
                <span className="font-display text-xs uppercase tracking-[0.1em] text-forest-soft">
                  {member.role}
                </span>
                <p className="text-sm leading-[1.5] text-ink-soft">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Timeline ───────────────────────────
          Hidden while the organization is in formation: the previous
          2018–2026 milestones were placeholder fiction. Restore this
          section once real milestones exist (see timeline_events in
          Supabase / admin panel).
      <section className="bg-cream py-28 md:py-32">
        <div className="container-iwacu">
          <div className="mb-15">
            <span className="font-display text-xs font-medium uppercase tracking-[0.14em] text-forest-soft">
              {t("timelineEyebrow")}
            </span>
            <h2 className="mt-3 font-display text-[clamp(40px,5vw,72px)] font-medium leading-none tracking-[-0.03em] text-forest">
              {t("timelineHeading")}
            </h2>
          </div>

          <div className="flex flex-col">
            {timelineItems.map((item, i) => (
              <div
                key={i}
                className={`grid grid-cols-[100px_1fr] items-baseline gap-6 border-t border-rule py-8 md:grid-cols-[140px_1fr_2fr] md:gap-10 ${
                  i === timelineItems.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="font-display text-[32px] font-medium tracking-[-0.02em] text-forest">
                  {item.year}
                </span>
                <span className="font-display text-[22px] font-medium leading-[1.2] tracking-[-0.015em] text-forest">
                  {item.title}
                </span>
                <span className="max-w-[52ch] text-[15px] leading-[1.55] text-ink-soft md:col-span-1">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
      ────────────────────────────────────────── */}

      {/* ── Contact CTA ──────────────────────── */}
      <section id="contact" className="bg-forest py-28 text-center text-oatmeal md:py-36">
        <div className="container-iwacu">
          <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(48px,6vw,88px)] font-medium leading-[0.98] tracking-[-0.03em]">
            {t("contactHeading")}
            <br />
            <em className="font-serif italic font-normal text-accent">
              {t("contactHeadingItalic")}
            </em>
          </h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-lg text-oatmeal/82">
            {t("contactDescription")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3.5">
            <a
              href="mailto:iwacucollective@gmail.com"
              className="inline-flex items-center gap-3 rounded-full bg-oatmeal px-6 py-3.5 font-display text-[15px] font-medium text-forest transition-transform hover:-translate-y-0.5"
            >
              iwacucollective@gmail.com
            </a>
            <a
              href="/#donate"
              className="inline-flex items-center gap-3 rounded-full border-[1.5px] border-oatmeal px-6 py-3.5 font-display text-[15px] font-medium text-oatmeal transition-all hover:bg-oatmeal hover:text-forest"
            >
              {t("supportWork")} <span>→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer variant="light" />
    </main>
  );
}
