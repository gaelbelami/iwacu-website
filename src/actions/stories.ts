"use server";

import { getAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStory(formData: FormData): Promise<void> {
  const admin = getAdminClient();

  try {
    const slug = (formData.get("slug") as string)?.trim();
    if (!slug) {
      redirect("/admin/stories/new?error=" + encodeURIComponent("Slug is required"));
      return;
    }

    const payload: Record<string, unknown> = {
      slug,
      title: {
        en: (formData.get("title_en") as string) || "",
        fr: (formData.get("title_fr") as string) || "",
      },
      excerpt: {
        en: (formData.get("excerpt_en") as string) || "",
        fr: (formData.get("excerpt_fr") as string) || "",
      },
      body: {
        en: (formData.get("body_en") as string) || "",
        fr: (formData.get("body_fr") as string) || "",
      },
      tag: {
        en: (formData.get("tag_en") as string) || "",
        fr: (formData.get("tag_fr") as string) || "",
      },
      tag_variant: (formData.get("tag_variant") as string) || "default",
      location: (formData.get("location") as string) || "",
      category: (formData.get("category") as string) || "",
      author_name: (formData.get("author_name") as string) || "",
      author_initials: (formData.get("author_initials") as string) || "",
      read_time: parseInt(formData.get("read_time") as string) || 5,
      is_featured: formData.get("is_featured") === "on",
      status: (formData.get("status") as string) || "draft",
      image_url: (formData.get("image_url") as string) || null,
    };

    if (payload.status === "published") {
      payload.published_at = new Date().toISOString();
    }

    const { error } = await admin.from("stories").insert(payload);
    if (error) {
      console.error("createStory error:", error.message);
      redirect("/admin/stories/new?error=" + encodeURIComponent(error.message));
      return;
    }

    revalidatePath("/admin/stories");
    redirect("/admin/stories");
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    console.error("createStory unexpected error:", e);
    redirect("/admin/stories/new?error=" + encodeURIComponent("Something went wrong"));
  }
}

export async function updateStory(id: string, formData: FormData): Promise<void> {
  const admin = getAdminClient();

  try {
    const payload: Record<string, unknown> = {
      slug: (formData.get("slug") as string)?.trim(),
      title: {
        en: (formData.get("title_en") as string) || "",
        fr: (formData.get("title_fr") as string) || "",
      },
      excerpt: {
        en: (formData.get("excerpt_en") as string) || "",
        fr: (formData.get("excerpt_fr") as string) || "",
      },
      body: {
        en: (formData.get("body_en") as string) || "",
        fr: (formData.get("body_fr") as string) || "",
      },
      tag: {
        en: (formData.get("tag_en") as string) || "",
        fr: (formData.get("tag_fr") as string) || "",
      },
      tag_variant: (formData.get("tag_variant") as string) || "default",
      location: (formData.get("location") as string) || "",
      category: (formData.get("category") as string) || "",
      author_name: (formData.get("author_name") as string) || "",
      author_initials: (formData.get("author_initials") as string) || "",
      read_time: parseInt(formData.get("read_time") as string) || 5,
      is_featured: formData.get("is_featured") === "on",
      status: (formData.get("status") as string) || "draft",
      image_url: (formData.get("image_url") as string) || null,
      updated_at: new Date().toISOString(),
    };

    if (payload.status === "published") {
      const { data: existing } = await admin
        .from("stories")
        .select("published_at")
        .eq("id", id)
        .single();
      if (!existing?.published_at) {
        payload.published_at = new Date().toISOString();
      }
    }

    const { error } = await admin.from("stories").update(payload).eq("id", id);
    if (error) {
      console.error("updateStory error:", error.message);
      redirect(`/admin/stories/${id}?error=` + encodeURIComponent(error.message));
      return;
    }

    revalidatePath("/admin/stories");
    redirect("/admin/stories");
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NEXT_REDIRECT") throw e;
    console.error("updateStory unexpected error:", e);
    redirect(`/admin/stories/${id}?error=` + encodeURIComponent("Something went wrong"));
  }
}

export async function deleteStory(id: string): Promise<void> {
  const admin = getAdminClient();
  try {
    await admin.from("stories").delete().eq("id", id);
    revalidatePath("/admin/stories");
  } catch (e) {
    console.error("deleteStory error:", e);
  }
}

export async function toggleStoryStatus(
  id: string,
  status: string
): Promise<void> {
  const admin = getAdminClient();
  try {
    const payload: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (status === "published") {
      payload.published_at = new Date().toISOString();
    }
    await admin.from("stories").update(payload).eq("id", id);
    revalidatePath("/admin/stories");
  } catch (e) {
    console.error("toggleStoryStatus error:", e);
  }
}
