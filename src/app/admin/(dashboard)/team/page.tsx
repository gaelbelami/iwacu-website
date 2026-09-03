import { getAdminClient } from "@/lib/supabase-admin";
import Link from "next/link";
import { DeleteTeamMemberButton, ToggleActiveButton } from "@/components/admin/TeamActions";

export default async function TeamListPage() {
  const admin = getAdminClient();

  const { data: members } = await admin
    .from("team_members")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
            Team Members
          </h1>
          <p className="text-[#2E3D2E]/60 mt-1">
            {members?.length ?? 0} members
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="px-5 py-2.5 bg-[#2E3D2E] text-[#EFE9DA] rounded-lg font-semibold text-sm hover:bg-[#2E3D2E]/90 transition-colors"
        >
          + Add Member
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members?.map((member) => {
          const name = typeof member.name === "object" ? (member.name as any).en : member.name;
          const role = typeof member.role === "object" ? (member.role as any).en : member.role;
          return (
            <div
              key={member.id}
              className={`bg-white rounded-xl border border-[#2E3D2E]/10 p-6 transition-all hover:shadow-sm ${
                !member.active ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#2E3D2E] rounded-full flex items-center justify-center text-[#E8C87A] font-bold font-[family-name:var(--font-space-grotesk)]">
                    {name?.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <Link
                      href={`/admin/team/${member.id}`}
                      className="font-semibold text-[#1A211A] hover:text-[#2E3D2E] hover:underline"
                    >
                      {name}
                    </Link>
                    <p className="text-sm text-[#2E3D2E]/60">{role}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  member.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {member.active ? "Active" : "Hidden"}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#2E3D2E]/5">
                <ToggleActiveButton id={member.id} currentActive={member.active} />
                <Link
                  href={`/admin/team/${member.id}`}
                  className="px-3 py-1 text-xs bg-[#F7F2E4] text-[#2E3D2E] rounded-md hover:bg-[#EFE9DA] transition-colors"
                >
                  Edit
                </Link>
                <DeleteTeamMemberButton id={member.id} />
              </div>
            </div>
          );
        })}
      </div>
      {(!members || members.length === 0) && (
        <div className="bg-white rounded-xl border border-[#2E3D2E]/10 p-12 text-center">
          <p className="text-sm text-[#2E3D2E]/50">No team members yet</p>
        </div>
      )}
    </div>
  );
}
