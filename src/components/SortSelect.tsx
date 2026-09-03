"use client";

import { useRouter } from "next/navigation";

export default function SortSelect({
  label,
  options,
  defaultValue,
}: {
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 font-display text-[13px] tracking-[0.06em] text-forest-soft">
      <span>{label}</span>
      <select
        defaultValue={defaultValue || options[0]?.value}
        onChange={(e) => {
          const params = new URLSearchParams(window.location.search);
          if (e.target.value && e.target.value !== "recent") {
            params.set("sort", e.target.value);
          } else {
            params.delete("sort");
          }
          params.delete("page");
          router.push(`?${params.toString()}`);
        }}
        className="border-none bg-transparent font-display text-[13px] font-medium text-forest outline-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
