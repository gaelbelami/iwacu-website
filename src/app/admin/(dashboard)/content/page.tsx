import { getAdminClient } from "@/lib/supabase-admin";
import { ContentEditor } from "@/components/admin/ContentEditor";

export default async function ContentPage() {
  const admin = getAdminClient();

  const [{ data: homepage }, { data: programs }, { data: settings }] = await Promise.all([
    admin.from("homepage").select("*").eq("id", "00000000-0000-0000-0000-000000000001").single(),
    admin.from("work_programs").select("*").order("sort_order"),
    admin.from("site_settings").select("content").eq("id", "00000000-0000-0000-0000-000000000001").single(),
  ]);

  const donate = ((settings?.content as Record<string, any>)?.donate || {}) as any;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
          Content Editor
        </h1>
        <p className="text-[#2E3D2E]/60 mt-1">Edit homepage, work programs, and donation settings</p>
      </div>
      <ContentEditor homepage={homepage as any} programs={programs as any} donate={donate} />
    </div>
  );
}
