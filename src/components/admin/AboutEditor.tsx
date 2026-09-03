"use client";

import { updateTimelineEvent, updateOrgValue, updateAboutContent } from "@/actions/about";
import { useState, useTransition } from "react";

interface TimelineEvent {
  id: string;
  year: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  sort_order: number;
  active: boolean;
}

interface OrgValue {
  id: string;
  number: string;
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  sort_order: number;
  active: boolean;
}

interface AboutContent {
  our_story?: {
    en?: { sidebarEyebrow?: string; sidebarHeading?: string; paragraphs?: string[] };
    fr?: { sidebarEyebrow?: string; sidebarHeading?: string; paragraphs?: string[] };
  };
}

export function AboutEditor({
  timeline,
  values,
  aboutContent,
}: {
  timeline: TimelineEvent[];
  values: OrgValue[];
  aboutContent: AboutContent;
}) {
  const [tab, setTab] = useState<"en" | "fr">("en");
  const [section, setSection] = useState<"timeline" | "values" | "story">("timeline");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleTimelineSubmit(id: string, formData: FormData) {
    startTransition(async () => {
      await updateTimelineEvent(id, formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  function handleValueSubmit(id: string, formData: FormData) {
    startTransition(async () => {
      await updateOrgValue(id, formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  function handleStorySubmit(formData: FormData) {
    startTransition(async () => {
      await updateAboutContent(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-1 bg-white rounded-xl border border-[#2E3D2E]/10 p-1.5 w-fit">
        {(["timeline", "values", "story"] as const).map((s) => (
          <button
            key={s}
            onClick={() => { setSection(s); setSaved(false); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              section === s ? "bg-[#2E3D2E] text-[#EFE9DA]" : "text-[#2E3D2E]/60 hover:text-[#2E3D2E]"
            }`}
          >
            {s === "story" ? "Our Story" : s}
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

      {/* Timeline Events */}
      {section === "timeline" && (
        <div className="space-y-4">
          {timeline?.map((event) => (
            <form
              key={event.id}
              action={(formData: FormData) => handleTimelineSubmit(event.id, formData)}
              className="bg-white rounded-xl border border-[#2E3D2E]/10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E] flex items-center gap-3">
                  <span className="bg-[#2E3D2E] text-[#E8C87A] px-3 py-1 rounded-full text-sm font-bold">
                    {event.year}
                  </span>
                  Timeline Event
                </h3>
                <div className="flex items-center gap-3">
                  <input type="hidden" name="active" value="on" />
                  <input type="hidden" name="sort_order" value={event.sort_order} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Year</label>
                  <input
                    name="year"
                    defaultValue={event.year}
                    className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Title</label>
                <input
                  name="title_en"
                  defaultValue={event.title?.en || ""}
                  className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "en" ? "hidden" : ""}`}
                />
                <input
                  name="title_fr"
                  defaultValue={event.title?.fr || ""}
                  className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "fr" ? "hidden" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Description</label>
                <textarea
                  name="desc_en"
                  defaultValue={event.description?.en || ""}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-none ${tab !== "en" ? "hidden" : ""}`}
                />
                <textarea
                  name="desc_fr"
                  defaultValue={event.description?.fr || ""}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-none ${tab !== "fr" ? "hidden" : ""}`}
                />
              </div>

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

      {/* Org Values */}
      {section === "values" && (
        <div className="space-y-4">
          {values?.map((val) => (
            <form
              key={val.id}
              action={(formData: FormData) => handleValueSubmit(val.id, formData)}
              className="bg-white rounded-xl border border-[#2E3D2E]/10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E] flex items-center gap-3">
                  <span className="bg-[#E8C87A] text-[#2E3D2E] w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                    {val.number}
                  </span>
                  Value
                </h3>
                <input type="hidden" name="active" value="on" />
                <input type="hidden" name="sort_order" value={val.sort_order} />
                <input type="hidden" name="number" value={val.number} />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Title</label>
                <input
                  name="title_en"
                  defaultValue={val.title?.en || ""}
                  className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "en" ? "hidden" : ""}`}
                />
                <input
                  name="title_fr"
                  defaultValue={val.title?.fr || ""}
                  className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "fr" ? "hidden" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Description</label>
                <textarea
                  name="desc_en"
                  defaultValue={val.description?.en || ""}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-none ${tab !== "en" ? "hidden" : ""}`}
                />
                <textarea
                  name="desc_fr"
                  defaultValue={val.description?.fr || ""}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-none ${tab !== "fr" ? "hidden" : ""}`}
                />
              </div>

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

      {/* Our Story */}
      {section === "story" && (
        <form action={handleStorySubmit} className="bg-white rounded-xl border border-[#2E3D2E]/10 p-6 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E] mb-4">
            Our Story Section
          </h2>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Eyebrow</label>
            <input
              name="story_eyebrow_en"
              defaultValue={aboutContent?.our_story?.en?.sidebarEyebrow || ""}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "en" ? "hidden" : ""}`}
            />
            <input
              name="story_eyebrow_fr"
              defaultValue={aboutContent?.our_story?.fr?.sidebarEyebrow || ""}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "fr" ? "hidden" : ""}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Heading</label>
            <input
              name="story_heading_en"
              defaultValue={aboutContent?.our_story?.en?.sidebarHeading || ""}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "en" ? "hidden" : ""}`}
            />
            <input
              name="story_heading_fr"
              defaultValue={aboutContent?.our_story?.fr?.sidebarHeading || ""}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "fr" ? "hidden" : ""}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Paragraph 1</label>
            <textarea
              name="story_p1_en"
              defaultValue={aboutContent?.our_story?.en?.paragraphs?.[0] || ""}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-y ${tab !== "en" ? "hidden" : ""}`}
            />
            <textarea
              name="story_p1_fr"
              defaultValue={aboutContent?.our_story?.fr?.paragraphs?.[0] || ""}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-y ${tab !== "fr" ? "hidden" : ""}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Paragraph 2</label>
            <textarea
              name="story_p2_en"
              defaultValue={aboutContent?.our_story?.en?.paragraphs?.[1] || ""}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-y ${tab !== "en" ? "hidden" : ""}`}
            />
            <textarea
              name="story_p2_fr"
              defaultValue={aboutContent?.our_story?.fr?.paragraphs?.[1] || ""}
              rows={4}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-y ${tab !== "fr" ? "hidden" : ""}`}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-[#2E3D2E] text-[#EFE9DA] rounded-lg font-semibold text-sm hover:bg-[#2E3D2E]/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Save Story"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
