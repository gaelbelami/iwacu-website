"use client";

import { createStory, updateStory } from "@/actions/stories";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { GalleryUploader } from "./GalleryUploader";

interface StoryData {
  id?: string;
  slug?: string;
  title?: { en: string; fr: string };
  excerpt?: { en: string; fr: string };
  body?: { en: string; fr: string };
  tag?: { en: string; fr: string };
  tag_variant?: string;
  location?: string;
  category?: string;
  author_name?: string;
  author_initials?: string;
  read_time?: number;
  is_featured?: boolean;
  status?: string;
  image_url?: string | null;
  gallery?: string[] | null;
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 bg-[#2E3D2E] text-[#EFE9DA] rounded-lg font-semibold text-sm hover:bg-[#2E3D2E]/90 transition-colors disabled:opacity-50"
    >
      {pending ? "Saving..." : isEditing ? "Save Changes" : "Create Story"}
    </button>
  );
}

export function StoryForm({ story }: { story?: StoryData }) {
  const isEditing = !!story?.id;
  const [tab, setTab] = useState("en");

  const formAction = isEditing
    ? updateStory.bind(null, story.id!)
    : createStory;

  return (
    <form action={formAction} className="space-y-6">
      {/* Status & Meta */}
      <div className="bg-white rounded-xl border border-[#2E3D2E]/10 p-6">
        <h2 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E] mb-4">
          Details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Slug *</label>
            <input
              name="slug"
              defaultValue={story?.slug || ""}
              required
              className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
              placeholder="my-story-slug"
            />
          </div>

          <div className="col-span-2">
            <ImageUploader
              name="image_url"
              defaultValue={story?.image_url}
              folder={`stories/${story?.slug || "new-story"}`}
              label="Cover Image"
            />
          </div>

          <div className="col-span-2">
            <GalleryUploader
              name="gallery"
              defaultValue={story?.gallery}
              folder={`stories/${story?.slug || "new-story"}`}
              label="Gallery Images (shown as a carousel on the story page)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Status</label>
            <select
              name="status"
              defaultValue={story?.status || "draft"}
              className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Location</label>
            <input
              name="location"
              defaultValue={story?.location || ""}
              className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
              placeholder="Bukavu, DRC"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Category</label>
            <input
              name="category"
              defaultValue={story?.category || ""}
              className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
              placeholder="education, shelter, health..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Read Time (min)</label>
            <input
              name="read_time"
              type="number"
              defaultValue={story?.read_time || 5}
              className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Author Name</label>
            <input
              name="author_name"
              defaultValue={story?.author_name || ""}
              className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Author Initials</label>
            <input
              name="author_initials"
              defaultValue={story?.author_initials || ""}
              className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
              maxLength={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Tag Variant</label>
            <select
              name="tag_variant"
              defaultValue={story?.tag_variant || "default"}
              className="w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20"
            >
              <option value="default">Default</option>
              <option value="success">Success</option>
              <option value="ongoing">Ongoing</option>
              <option value="voices">Voices</option>
              <option value="field">Field</option>
            </select>
          </div>

          <div className="flex items-center gap-3 col-span-2">
            <input
              type="checkbox"
              name="is_featured"
              id="is_featured"
              defaultChecked={story?.is_featured || false}
              className="w-4 h-4 accent-[#2E3D2E]"
            />
            <label htmlFor="is_featured" className="text-sm font-medium text-[#2E3D2E]/80">
              Featured story
            </label>
          </div>
        </div>
      </div>

      {/* Bilingual Content */}
      <div className="bg-white rounded-xl border border-[#2E3D2E]/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
            Content
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
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Title *</label>
            <input
              name="title_en"
              defaultValue={story?.title?.en || ""}
              required
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "en" ? "hidden" : ""}`}
              placeholder="Story title in English"
            />
            <input
              name="title_fr"
              defaultValue={story?.title?.fr || ""}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "fr" ? "hidden" : ""}`}
              placeholder="Titre en français"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Tag</label>
            <input
              name="tag_en"
              defaultValue={story?.tag?.en || ""}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "en" ? "hidden" : ""}`}
              placeholder="e.g. Success"
            />
            <input
              name="tag_fr"
              defaultValue={story?.tag?.fr || ""}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 ${tab !== "fr" ? "hidden" : ""}`}
              placeholder="ex. Succès"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Excerpt</label>
            <textarea
              name="excerpt_en"
              defaultValue={story?.excerpt?.en || ""}
              rows={2}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-none ${tab !== "en" ? "hidden" : ""}`}
              placeholder="Short summary in English"
            />
            <textarea
              name="excerpt_fr"
              defaultValue={story?.excerpt?.fr || ""}
              rows={2}
              className={`w-full px-4 py-2 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-none ${tab !== "fr" ? "hidden" : ""}`}
              placeholder="Bref résumé en français"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">Body</label>
            <textarea
              name="body_en"
              defaultValue={story?.body?.en || ""}
              rows={8}
              className={`w-full px-4 py-3 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-y font-mono ${tab !== "en" ? "hidden" : ""}`}
              placeholder="Write your story content here..."
            />
            <textarea
              name="body_fr"
              defaultValue={story?.body?.fr || ""}
              rows={8}
              className={`w-full px-4 py-3 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] text-sm focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/20 resize-y font-mono ${tab !== "fr" ? "hidden" : ""}`}
              placeholder="Contenu en français..."
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <a
          href="/admin/stories"
          className="px-5 py-2.5 border border-[#2E3D2E]/20 text-[#2E3D2E] rounded-lg font-medium text-sm hover:bg-[#2E3D2E]/5 transition-colors"
        >
          Cancel
        </a>
        <SubmitButton isEditing={isEditing} />
      </div>
    </form>
  );
}
