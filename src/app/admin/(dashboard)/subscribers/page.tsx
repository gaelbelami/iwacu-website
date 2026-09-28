import { getAdminClient } from "@/lib/supabase-admin";
import { NewsletterComposer } from "@/components/admin/NewsletterComposer";

export default async function SubscribersPage() {
  const admin = getAdminClient();

  const { data: subscribers } = await admin
    .from("newsletter_subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  const activeCount = subscribers?.filter((s: any) => !s.unsubscribed_at).length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
            Subscribers
          </h1>
          <p className="text-[#2E3D2E]/60 mt-1">
            {activeCount} active subscriber{activeCount !== 1 ? "s" : ""}
          </p>
        </div>
        {subscribers && subscribers.length > 0 && (
          <a
            href={`data:text/csv;charset=utf-8,${encodeURIComponent(
              "email,subscribed_at,source\n" +
                subscribers.map((s: any) => `${s.email},${s.subscribed_at},${s.source}`).join("\n")
            )}`}
            download="subscribers.csv"
            className="px-5 py-2.5 border border-[#2E3D2E]/20 text-[#2E3D2E] rounded-lg font-medium text-sm hover:bg-[#2E3D2E]/5 transition-colors"
          >
            Export CSV
          </a>
        )}
      </div>

      <NewsletterComposer activeCount={activeCount} />

      <div className="bg-white rounded-xl border border-[#2E3D2E]/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2E3D2E]/10 bg-[#F7F2E4]/50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#2E3D2E]/60 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#2E3D2E]/60 uppercase tracking-wider">
                Subscribed
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#2E3D2E]/60 uppercase tracking-wider">
                Source
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-[#2E3D2E]/60 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E3D2E]/5">
            {subscribers?.map((sub: any) => (
              <tr key={sub.id} className="hover:bg-[#F7F2E4]/30 transition-colors">
                <td className="px-6 py-3 text-sm font-medium text-[#1A211A]">{sub.email}</td>
                <td className="px-6 py-3 text-sm text-[#2E3D2E]/70">
                  {new Date(sub.subscribed_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-3 text-sm text-[#2E3D2E]/70">{sub.source}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sub.unsubscribed_at
                        ? "bg-gray-100 text-gray-500"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {sub.unsubscribed_at ? "Unsubscribed" : "Active"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!subscribers || subscribers.length === 0) && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-[#2E3D2E]/50">No subscribers yet</p>
            <p className="text-xs text-[#2E3D2E]/30 mt-1">
              Subscribers will appear here when they sign up through the newsletter form
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
