import { getAdminClient } from "@/lib/supabase-admin";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { notFound } from "next/navigation";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admin = getAdminClient();

  const { data: member, error } = await admin
    .from("team_members")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !member) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
          Edit Team Member
        </h1>
        <p className="text-[#2E3D2E]/60 mt-1">
          {typeof member.name === "object" ? (member.name as any).en : member.name}
        </p>
      </div>
      <TeamMemberForm member={member as any} />
    </div>
  );
}
