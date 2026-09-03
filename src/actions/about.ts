"use server";

import { getAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function updateTimelineEvent(id: string, formData: FormData): Promise<void> {
  const admin = getAdminClient();
  await admin.from("timeline_events").update({
    year: (formData.get("year") as string) || "",
    title: {
      en: (formData.get("title_en") as string) || "",
      fr: (formData.get("title_fr") as string) || "",
    },
    description: {
      en: (formData.get("desc_en") as string) || "",
      fr: (formData.get("desc_fr") as string) || "",
    },
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    active: formData.get("active") === "on",
  }).eq("id", id);

  revalidatePath("/about");
  revalidatePath("/admin/about");
}

export async function updateOrgValue(id: string, formData: FormData): Promise<void> {
  const admin = getAdminClient();
  await admin.from("org_values").update({
    number: (formData.get("number") as string) || "",
    title: {
      en: (formData.get("title_en") as string) || "",
      fr: (formData.get("title_fr") as string) || "",
    },
    description: {
      en: (formData.get("desc_en") as string) || "",
      fr: (formData.get("desc_fr") as string) || "",
    },
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    active: formData.get("active") === "on",
  }).eq("id", id);

  revalidatePath("/about");
  revalidatePath("/admin/about");
}

export async function updateAboutContent(formData: FormData): Promise<void> {
  const admin = getAdminClient();

  const our_story = {
    en: {
      sidebarEyebrow: formData.get("story_eyebrow_en") as string,
      sidebarHeading: formData.get("story_heading_en") as string,
      paragraphs: [
        formData.get("story_p1_en") as string,
        formData.get("story_p2_en") as string,
      ],
    },
    fr: {
      sidebarEyebrow: formData.get("story_eyebrow_fr") as string,
      sidebarHeading: formData.get("story_heading_fr") as string,
      paragraphs: [
        formData.get("story_p1_fr") as string,
        formData.get("story_p2_fr") as string,
      ],
    },
  };

  await admin
    .from("about_content")
    .update({ our_story, updated_at: new Date().toISOString() })
    .eq("id", "70000000-0000-0000-0000-000000000001");

  revalidatePath("/about");
  revalidatePath("/admin/about");
}
