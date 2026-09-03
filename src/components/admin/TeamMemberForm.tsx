"use client";

import { createTeamMember, updateTeamMember } from "@/actions/team";
import { useState } from "react";
import { ImageUploader } from "./ImageUploader";

interface TeamMemberData {
  id?: string;
  name?: { en: string; fr: string };
  role?: { en: string; fr: string };
  bio?: { en: string; fr: string };
  sort_order?: number;
  active?: boolean;
  image_url?: string | null;
}

export function TeamMemberForm({ member }: { member?: TeamMemberData }) {
  const isEditing = !!member?.id;
  const [tab, setTab] = useState<"en" | "fr">("en");

  const formAction = isEditing
    ? updateTeamMember.bind(null, member.id!)
    : createTeamMember;

  return (
    <form action={formAction} className="space-y-6">
      {/* Settings */}
      <div className="bg-white rounded-xl border border-[#2E3D2E]/10 p-6">
        <h2 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E] mb-4">
          Settings
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Sort Order</label>
            <input
              name="sort_order"
              type="number"
              defaultValue={member?.sort_order ?? 0}
              className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
            />
          </div>
          <div className="col-span-2">
            <ImageUploader
              name="image_url"
              defaultValue={member?.image_url}
              folder="team"
              label="Portrait Photo"
            />
          </div>
          <div className="flex items-center gap-3 col-span-2">
            <input
              type="checkbox"
              name="active"
              id="active"
              defaultChecked={member?.active !== false}
              className="w-4 h-4 accent-[#2E3D2E]"
            />
            <label htmlFor="active" className="text-sm font-medium text-[#2E3D2E]/80">
              Active (visible on website)
            </label>
          </div>
        </div>
      </div>

      {/* Bilingual Content */}
      <div className="bg-white rounded-xl border border-[#2E3D2E]/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
            Member Details
          </h2>
          <div className="flex gap-1 bg-[#F7F2E4] rounded-lg p-1">
            <button
              type="button"
              onClick={() => setTab("en")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === "en" ? "bg-white shadow-sm text-[#2E3D2E]" : "text-[#2E3D2E]/50"
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setTab("fr")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === "fr" ? "bg-white shadow-sm text-[#2E3D2E]" : "text-[#2E3D2E]/50"
              }`}
            >
              Français
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Name *</label>
            <input
              name="name_en"
              required
              defaultValue={member?.name?.en || ""}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "en" ? "hidden" : ""}`}
              placeholder="Full name"
            />
            <input
              name="name_fr"
              defaultValue={member?.name?.fr || ""}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "fr" ? "hidden" : ""}`}
              placeholder="Nom complet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Role *</label>
            <input
              name="role_en"
              required
              defaultValue={member?.role?.en || ""}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "en" ? "hidden" : ""}`}
              placeholder="e.g. Founder & Executive Director"
            />
            <input
              name="role_fr"
              defaultValue={member?.role?.fr || ""}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "fr" ? "hidden" : ""}`}
              placeholder="ex. Fondatrice et directrice exécutive"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Bio</label>
            <textarea
              name="bio_en"
              defaultValue={member?.bio?.en || ""}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-y ${tab !== "en" ? "hidden" : ""}`}
              placeholder="Short biography..."
            />
            <textarea
              name="bio_fr"
              defaultValue={member?.bio?.fr || ""}
              rows={4}
              className={`w-full px-4 py-3 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-y ${tab !== "fr" ? "hidden" : ""}`}
              placeholder="Courte biographie..."
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <a
          href="/admin/team"
          className="px-5 py-2.5 border border-[#2E3D2E]/20 text-[#2E3D2E] rounded-lg font-medium text-sm hover:bg-[#2E3D2E]/5 transition-colors"
        >
          Cancel
        </a>
        <button
          type="submit"
          className="px-6 py-2.5 bg-[#2E3D2E] text-[#EFE9DA] rounded-lg font-semibold text-sm hover:bg-[#2E3D2E]/90 transition-colors"
        >
          {isEditing ? "Save Changes" : "Add Team Member"}
        </button>
      </div>
    </form>
  );
}
