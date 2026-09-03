import { getAdminClient } from "@/lib/supabase-admin";
import Link from "next/link";

export default async function AdminDashboard() {
  const admin = getAdminClient();

  const [
    { count: storiesCount },
    { count: publishedCount },
    { count: draftCount },
    { count: subscribersCount },
    { count: programsCount },
  ] = await Promise.all([
    admin.from("stories").select("*", { count: "exact", head: true }),
    admin.from("stories").select("*", { count: "exact", head: true }).eq("status", "published"),
    admin.from("stories").select("*", { count: "exact", head: true }).eq("status", "draft"),
    admin.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
    admin.from("work_programs").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total Stories", value: storiesCount ?? 0, href: "/admin/stories", color: "bg-[#2E3D2E] text-[#EFE9DA]" },
    { label: "Published", value: publishedCount ?? 0, href: "/admin/stories", color: "bg-emerald-100 text-emerald-800" },
    { label: "Drafts", value: draftCount ?? 0, href: "/admin/stories", color: "bg-amber-100 text-amber-800" },
    { label: "Subscribers", value: subscribersCount ?? 0, href: "/admin/subscribers", color: "bg-blue-100 text-blue-800" },
    { label: "Programs", value: programsCount ?? 0, href: "/admin/content", color: "bg-purple-100 text-purple-800" },
  ];

  // Get recent stories
  const { data: recentStories } = await admin
    .from("stories")
    .select("id, slug, title, status, published_at, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
          Dashboard
        </h1>
        <p className="text-[#2E3D2E]/60 mt-1">Manage your content and stories</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`${stat.color} rounded-xl p-4 transition-transform hover:scale-[1.02]`}
          >
            <p className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)]">
              {stat.value}
            </p>
            <p className="text-sm opacity-80">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-8">
        <Link
          href="/admin/stories/new"
          className="px-5 py-2.5 bg-[#2E3D2E] text-[#EFE9DA] rounded-lg font-semibold text-sm hover:bg-[#2E3D2E]/90 transition-colors"
        >
          + New Story
        </Link>
        <Link
          href="/admin/content"
          className="px-5 py-2.5 border border-[#2E3D2E]/20 text-[#2E3D2E] rounded-lg font-medium text-sm hover:bg-[#2E3D2E]/5 transition-colors"
        >
          Edit Content
        </Link>
      </div>

      {/* Recent Stories */}
      <div className="bg-white rounded-xl border border-[#2E3D2E]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#2E3D2E]/10">
          <h2 className="font-semibold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
            Recent Stories
          </h2>
        </div>
        <div className="divide-y divide-[#2E3D2E]/5">
          {recentStories?.map((story) => {
            const title = typeof story.title === "object" ? (story.title as any).en : story.title;
            return (
              <Link
                key={story.id}
                href={`/admin/stories/${story.id}`}
                className="flex items-center justify-between px-6 py-3 hover:bg-[#F7F2E4]/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm text-[#1A211A]">{title || story.slug}</p>
                  <p className="text-xs text-[#2E3D2E]/50">{story.slug}</p>
                </div>
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
              </Link>
            );
          })}
          {(!recentStories || recentStories.length === 0) && (
            <p className="px-6 py-8 text-center text-sm text-[#2E3D2E]/50">
              No stories yet. Create your first one!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
