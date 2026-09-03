"use client";

import { deleteTeamMember, toggleTeamMemberActive } from "@/actions/team";
import { useTransition } from "react";

export function DeleteTeamMemberButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("Remove this team member?")) {
          startTransition(() => deleteTeamMember(id));
        }
      }}
      disabled={isPending}
      className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
    >
      {isPending ? "..." : "Remove"}
    </button>
  );
}

export function ToggleActiveButton({ id, currentActive }: { id: string; currentActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => toggleTeamMemberActive(id, !currentActive))}
      disabled={isPending}
      className={`px-3 py-1 text-xs rounded-md transition-colors disabled:opacity-50 ${
        currentActive
          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      }`}
    >
      {isPending ? "..." : currentActive ? "Hide" : "Show"}
    </button>
  );
}
