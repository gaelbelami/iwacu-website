import { StoryForm } from "@/components/admin/StoryForm";

export default async function NewStoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
          New Story
        </h1>
        <p className="text-[#2E3D2E]/60 mt-1">Create a new story in English and French</p>
      </div>
      {params.error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {params.error}
        </div>
      )}
      <StoryForm />
    </div>
  );
}
