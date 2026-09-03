import { TeamMemberForm } from "@/components/admin/TeamMemberForm";

export default async function NewTeamMemberPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
          Add Team Member
        </h1>
        <p className="text-[#2E3D2E]/60 mt-1">Add a new member to the team</p>
      </div>
      {params.error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {params.error}
        </div>
      )}
      <TeamMemberForm />
    </div>
  );
}
