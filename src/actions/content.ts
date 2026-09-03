"use server";

import { getAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function updateHomepage(formData: FormData): Promise<void> {
  const admin = getAdminClient();

  const hero = {
    en: {
      eyebrow: formData.get("hero_eyebrow_en") as string,
      heading: formData.get("hero_heading_en") as string,
      headingItalic: formData.get("hero_heading_italic_en") as string,
      description: formData.get("hero_description_en") as string,
      ctaPrimary: formData.get("hero_cta_primary_en") as string,
      ctaSecondary: formData.get("hero_cta_secondary_en") as string,
    },
    fr: {
      eyebrow: formData.get("hero_eyebrow_fr") as string,
      heading: formData.get("hero_heading_fr") as string,
      headingItalic: formData.get("hero_heading_italic_fr") as string,
      description: formData.get("hero_description_fr") as string,
      ctaPrimary: formData.get("hero_cta_primary_fr") as string,
      ctaSecondary: formData.get("hero_cta_secondary_fr") as string,
    },
  };

  const mission = {
    en: {
      heading: formData.get("mission_heading_en") as string,
      headingItalic: formData.get("mission_heading_italic_en") as string,
      paragraph: formData.get("mission_paragraph_en") as string,
    },
    fr: {
      heading: formData.get("mission_heading_fr") as string,
      headingItalic: formData.get("mission_heading_italic_fr") as string,
      paragraph: formData.get("mission_paragraph_fr") as string,
    },
  };

  await admin
    .from("homepage")
    .update({ hero, mission, updated_at: new Date().toISOString() })
    .eq("id", "00000000-0000-0000-0000-000000000001");

  revalidatePath("/");
  revalidatePath("/admin/content");
}

export async function updateWorkProgram(id: string, formData: FormData): Promise<void> {
  const admin = getAdminClient();

  await admin
    .from("work_programs")
    .update({
      title: { en: formData.get("title_en") as string, fr: formData.get("title_fr") as string },
      description: { en: formData.get("desc_en") as string, fr: formData.get("desc_fr") as string },
    })
    .eq("id", id);

  revalidatePath("/");
  revalidatePath("/admin/content");
}
