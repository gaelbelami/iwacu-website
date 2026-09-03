import { getAdminClient } from "@/lib/supabase-admin";
import Link from "next/link";
import { DeleteStoryButton, ToggleStatusButton } from "@/components/admin/StoryActions";

export default async function StoriesListPage() {
  const admin = getAdminClient();

  const { data: stories } = await admin
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
            Stories
          </h1>
          <p className="text-[#2E3D2E]/60 mt-1">
            {stories?.length ?? 0} stories total
          </p>
        </div>
        <Link
          href="/admin/stories/new"
          className="px-5 py-2.5 bg-[#2E3D2E] text-[#EFE9DA] rounded-lg font-semibold text-sm hover:bg-[#2E3D2E]/90 transition-colors"
        >
          + New Story
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#2E3D2E]/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2E3D2E]/10 bg-[#F7F2E4]/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#2E3D2E]/60 uppercase tracking-wider">
                Title
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#2E3D2E]/60 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#2E3D2E]/60 uppercase tracking-wider">
                Location
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#2E3D2E]/60 uppercase tracking-wider">
                Featured
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-[#2E3D2E]/60 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E3D2E]/5">
            {stories?.map((story) => {
              const title = typeof story.title === "object" ? (story.title as any).en : story.title;
              return (
                <tr key={story.id} className="hover:bg-[#F7F2E4]/30 transition-colors">
                  <td className="px-6 py-3">
                    <Link
                      href={`/admin/stories/${story.id}`}
                      className="font-medium text-sm text-[#1A211A] hover:text-[#2E3D2E] hover:underline"
                    >
                      {title || story.slug}
                    </Link>
                    <p className="text-xs text-[#2E3D2E]/40 mt-0.5">{story.slug}</p>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        story.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : story.status === "draft"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {story.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-[#2E3D2E]/70">
                    {story.location || "—"}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {story.is_featured ? (
                      <span className="text-[#E8C87A]">★</span>
                    ) : (
                      <span className="text-[#2E3D2E]/20">☆</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <ToggleStatusButton id={story.id} currentStatus={story.status} />
                      <Link
                        href={`/admin/stories/${story.id}`}
                        className="px-3 py-1 text-xs bg-[#F7F2E4] text-[#2E3D2E] rounded-md hover:bg-[#EFE9DA] transition-colors"
                      >
                        Edit
                      </Link>
                      <DeleteStoryButton id={story.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(!stories || stories.length === 0) && (
          <p className="px-6 py-12 text-center text-sm text-[#2E3D2E]/50">
            No stories yet. Create your first one!
          </p>
        )}
      </div>
    </div>
  );
}
