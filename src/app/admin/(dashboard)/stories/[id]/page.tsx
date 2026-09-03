import { getAdminClient } from "@/lib/supabase-admin";
import { StoryForm } from "@/components/admin/StoryForm";
import { notFound } from "next/navigation";

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = getAdminClient();

  const { data: story, error } = await admin
    .from("stories")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !story) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
          Edit Story
        </h1>
        <p className="text-[#2E3D2E]/60 mt-1">{story.slug}</p>
      </div>
      <StoryForm story={story as any} />
    </div>
  );
}
