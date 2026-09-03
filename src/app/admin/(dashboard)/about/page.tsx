import { getAdminClient } from "@/lib/supabase-admin";
import { AboutEditor } from "@/components/admin/AboutEditor";

export default async function AboutEditorPage() {
  const admin = getAdminClient();

  const [
    { data: timeline },
    { data: values },
    { data: aboutContent },
  ] = await Promise.all([
    admin.from("timeline_events").select("*").order("sort_order"),
    admin.from("org_values").select("*").order("sort_order"),
    admin.from("about_content").select("*").eq("id", "70000000-0000-0000-0000-000000000001").single(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
          About Page Editor
        </h1>
        <p className="text-[#2E3D2E]/60 mt-1">Edit timeline, values, and about content</p>
      </div>
      <AboutEditor
        timeline={timeline as any}
        values={values as any}
        aboutContent={aboutContent as any}
      />
    </div>
  );
}
