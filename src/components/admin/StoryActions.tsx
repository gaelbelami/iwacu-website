"use client";

import { deleteStory, toggleStoryStatus } from "@/actions/stories";
import { useTransition } from "react";

export function DeleteStoryButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (confirm("Delete this story? This cannot be undone.")) {
          startTransition(() => deleteStory(id));
        }
      }}
      disabled={isPending}
      className="px-3 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
    >
      {isPending ? "..." : "Delete"}
    </button>
  );
}

export function ToggleStatusButton({ id, currentStatus }: { id: string; currentStatus: string }) {
  const [isPending, startTransition] = useTransition();
  const nextStatus = currentStatus === "published" ? "draft" : "published";

  return (
    <button
      onClick={() => startTransition(() => toggleStoryStatus(id, nextStatus))}
      disabled={isPending}
      className={`px-3 py-1 text-xs rounded-md transition-colors disabled:opacity-50 ${
        currentStatus === "published"
          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      }`}
    >
      {isPending ? "..." : currentStatus === "published" ? "Unpublish" : "Publish"}
    </button>
  );
}
