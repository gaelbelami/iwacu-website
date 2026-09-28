"use client";

import { updateDonateSettings, updateHomepage, updateWorkProgram } from "@/actions/content";
import { useState, useTransition } from "react";

interface HomepageData {
  hero?: { en?: Record<string, string>; fr?: Record<string, string> };
  mission?: { en?: Record<string, string>; fr?: Record<string, string> };
}

interface ProgramData {
  id: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
}

interface DonateData {
  goal?: number;
  raised?: number;
  currency?: string;
  stripeUrl?: string;
  mobileText?: { en: string; fr: string };
  bankText?: { en: string; fr: string };
}

export function ContentEditor({
  homepage,
  programs,
  donate,
}: {
  homepage: HomepageData;
  programs: ProgramData[];
  donate?: DonateData;
}) {
  const [tab, setTab] = useState<"en" | "fr">("en");
  const [section, setSection] = useState<"hero" | "mission" | "programs" | "donate">("hero");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleHomepageSubmit(formData: FormData) {
    startTransition(async () => {
      await updateHomepage(formData);
      flashSaved();
    });
  }

  function handleProgramSubmit(id: string, formData: FormData) {
    startTransition(async () => {
      await updateWorkProgram(id, formData);
      flashSaved();
    });
  }

  function handleDonateSubmit(formData: FormData) {
    startTransition(async () => {
      await updateDonateSettings(formData);
      flashSaved();
    });
  }

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-[#2E3D2E]/10 p-1.5 w-fit">
        {(["hero", "mission", "programs", "donate"] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setSection(s); setSaved(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              section === s ? "bg-[#2E3D2E] text-[#EFE9DA]" : "text-[#2E3D2E]/60 hover:text-[#2E3D2E]"
            }`}
          >
            {s === "programs" ? "Work Programs" : s}
          </button>
        ))}
      </div>

      {/* Language Toggle */}
      <div className="flex gap-1 bg-[#F7F2E4] rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab("en")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            tab === "en" ? "bg-white shadow-sm text-[#2E3D2E]" : "text-[#2E3D2E]/50"
          }`}
        >
          English
        </button>
        <button
          onClick={() => setTab("fr")}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            tab === "fr" ? "bg-white shadow-sm text-[#2E3D2E]" : "text-[#2E3D2E]/50"
          }`}
        >
          Français
        </button>
      </div>

      {saved && (
        <div className="px-4 py-2 rounded-lg text-sm bg-emerald-100 text-emerald-700">
          Saved successfully!
        </div>
      )}

      {/* Hero Section */}
      {section === "hero" && (
        <form action={handleHomepageSubmit} className="bg-white rounded-xl border border-[#2E3D2E]/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E] mb-4">
            Hero Section
          </h2>

          <Field name="hero_eyebrow" label="Eyebrow" tab={tab} values={homepage?.hero} />
          <Field name="hero_heading" label="Heading" tab={tab} values={homepage?.hero} />
          <Field name="hero_heading_italic" label="Heading Italic Word" tab={tab} values={homepage?.hero} />
          <FieldTextarea name="hero_description" label="Description" tab={tab} values={homepage?.hero} />
          <Field name="hero_cta_primary" label="Primary CTA Text" tab={tab} values={homepage?.hero} />
          <Field name="hero_cta_secondary" label="Secondary CTA Text" tab={tab} values={homepage?.hero} />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-[#2E3D2E] text-[#EFE9DA] rounded-lg font-semibold text-sm hover:bg-[#2E3D2E]/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Hero"}
            </button>
          </div>
        </form>
      )}

      {/* Mission Section */}
      {section === "mission" && (
        <form action={handleHomepageSubmit} className="bg-white rounded-xl border border-[#2E3D2E]/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E] mb-4">
            Mission Section
          </h2>

          <Field name="mission_heading" label="Heading" tab={tab} values={homepage?.mission} />
          <Field name="mission_heading_italic" label="Heading Italic Word" tab={tab} values={homepage?.mission} />
          <FieldTextarea name="mission_paragraph" label="Paragraph" tab={tab} values={homepage?.mission} rows={4} />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-[#2E3D2E] text-[#EFE9DA] rounded-lg font-semibold text-sm hover:bg-[#2E3D2E]/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Mission"}
            </button>
          </div>
        </form>
      )}

      {/* Work Programs */}
      {section === "programs" && (
        <div className="space-y-4">
          {programs?.map((program, i) => (
            <form
              key={program.id}
              action={(formData: FormData) => handleProgramSubmit(program.id, formData)}
              className="bg-white rounded-xl border border-[#2E3D2E]/10 p-6 space-y-4"
            >
              <h3 className="font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
                Program {i + 1}
              </h3>
              <Field name="title" label="Title" tab={tab} values={program.title as any} />
              <FieldTextarea name="desc" label="Description" tab={tab} values={program.description as any} rows={3} />
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 bg-[#2E3D2E] text-[#EFE9DA] rounded-lg font-semibold text-sm hover:bg-[#2E3D2E]/90 transition-colors disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          ))}
        </div>
      )}

      {/* Donate settings */}
      {section === "donate" && (
        <form action={handleDonateSubmit} className="bg-white rounded-xl border border-[#2E3D2E]/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E] mb-4">
            Donation Page Settings
          </h2>
          <p className="text-sm text-[#2E3D2E]/60 -mt-2">
            Drives the funding progress bar and the ways-to-give cards on the public donate page. Leave a field empty to show its "coming soon" state.
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Goal amount</label>
              <input
                name="goal"
                type="number"
                min="0"
                step="any"
                defaultValue={donate?.goal || 0}
                className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Raised so far</label>
              <input
                name="raised"
                type="number"
                min="0"
                step="any"
                defaultValue={donate?.raised || 0}
                className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Currency</label>
              <input
                name="currency"
                defaultValue={donate?.currency || "USD"}
                placeholder="USD"
                className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Stripe payment link</label>
            <input
              name="stripe_url"
              type="url"
              defaultValue={donate?.stripeUrl || ""}
              placeholder="https://buy.stripe.com/… (leave empty until your Stripe account is ready)"
              className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
            />
          </div>

          <FieldTextarea
            name="mobile_text"
            label="Mobile money instructions"
            tab={tab}
            values={donate?.mobileText as any}
            rows={3}
          />
          <FieldTextarea
            name="bank_text"
            label="Bank transfer instructions"
            tab={tab}
            values={donate?.bankText as any}
            rows={3}
          />

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-[#2E3D2E] text-[#EFE9DA] rounded-lg font-semibold text-sm hover:bg-[#2E3D2E]/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Donate Settings"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({ name, label, tab, values }: { name: string; label: string; tab: "en" | "fr"; values?: Record<string, any> }) {
  const getKey = (n: string) => n.replace(/^hero_/, "").replace(/^mission_/, "");
  return (
    <div>
      <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">{label}</label>
      <input
        name={`${name}_en`}
        defaultValue={values?.en?.[getKey(name)] || ""}
        className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "en" ? "hidden" : ""}`}
      />
      <input
        name={`${name}_fr`}
        defaultValue={values?.fr?.[getKey(name)] || ""}
        className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "fr" ? "hidden" : ""}`}
      />
    </div>
  );
}

function FieldTextarea({ name, label, tab, values, rows = 3 }: { name: string; label: string; tab: "en" | "fr"; values?: Record<string, any>; rows?: number }) {
  const getKey = (n: string) => n.replace(/^hero_/, "").replace(/^mission_/, "");
  return (
    <div>
      <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">{label}</label>
      <textarea
        name={`${name}_en`}
        defaultValue={values?.en?.[getKey(name)] || ""}
        rows={rows}
        className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-none ${tab !== "en" ? "hidden" : ""}`}
      />
      <textarea
        name={`${name}_fr`}
        defaultValue={values?.fr?.[getKey(name)] || ""}
        rows={rows}
        className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-none ${tab !== "fr" ? "hidden" : ""}`}
      />
    </div>
  );
}
