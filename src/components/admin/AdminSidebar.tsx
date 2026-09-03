"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/actions/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "□" },
  { href: "/admin/stories", label: "Stories", icon: "✎" },
  { href: "/admin/team", label: "Team", icon: "◉" },
  { href: "/admin/content", label: "Content", icon: "◈" },
  { href: "/admin/about", label: "About", icon: "⌘" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "✉" },
];

export function AdminSidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#2E3D2E] text-[#EFE9DA] flex flex-col">
      {/* Brand */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#E8C87A] rounded-lg flex items-center justify-center">
            <span className="text-[#2E3D2E] font-bold text-sm font-[family-name:var(--font-space-grotesk)]">
              ICC
            </span>
          </div>
          <div>
            <p className="font-semibold text-sm font-[family-name:var(--font-space-grotesk)]">
              ICC Admin
            </p>
            <p className="text-xs text-white/50 truncate max-w-[140px]">
              {userEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to site + Logout */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white/80 transition-colors"
        >
          <span>↗</span> View Site
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 hover:text-white/80 transition-colors w-full text-left"
          >
            <span>←</span> Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
