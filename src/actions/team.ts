"use server";

import { getAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTeamMember(formData: FormData): Promise<void> {
  const admin = getAdminClient();

  const payload: Record<string, unknown> = {
    name: {
      en: (formData.get("name_en") as string) || "",
      fr: (formData.get("name_fr") as string) || "",
    },
    role: {
      en: (formData.get("role_en") as string) || "",
      fr: (formData.get("role_fr") as string) || "",
    },
    bio: {
      en: (formData.get("bio_en") as string) || "",
      fr: (formData.get("bio_fr") as string) || "",
    },
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    active: formData.get("active") === "on",
    image_url: (formData.get("image_url") as string) || null,
  };

  const { error } = await admin.from("team_members").insert(payload);
  if (error) {
    redirect("/admin/team/new?error=" + encodeURIComponent(error.message));
    return;
  }

  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function updateTeamMember(id: string, formData: FormData): Promise<void> {
  const admin = getAdminClient();

  const payload: Record<string, unknown> = {
    name: {
      en: (formData.get("name_en") as string) || "",
      fr: (formData.get("name_fr") as string) || "",
    },
    role: {
      en: (formData.get("role_en") as string) || "",
      fr: (formData.get("role_fr") as string) || "",
    },
    bio: {
      en: (formData.get("bio_en") as string) || "",
      fr: (formData.get("bio_fr") as string) || "",
    },
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
    active: formData.get("active") === "on",
    image_url: (formData.get("image_url") as string) || null,
  };

  const { error } = await admin.from("team_members").update(payload).eq("id", id);
  if (error) {
    redirect(`/admin/team/${id}?error=` + encodeURIComponent(error.message));
    return;
  }

  revalidatePath("/admin/team");
  redirect("/admin/team");
}

export async function deleteTeamMember(id: string): Promise<void> {
  const admin = getAdminClient();
  const { error } = await admin.from("team_members").delete().eq("id", id);
  if (error) {
    console.error("deleteTeamMember error:", error.message);
  }
  revalidatePath("/admin/team");
}

export async function toggleTeamMemberActive(id: string, active: boolean): Promise<void> {
  const admin = getAdminClient();
  await admin.from("team_members").update({ active }).eq("id", id);
  revalidatePath("/admin/team");
}
