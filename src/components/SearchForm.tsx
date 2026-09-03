"use client";

import { useRouter } from "next/navigation";

export default function SearchForm({
  placeholder,
  defaultValue,
}: {
  placeholder: string;
  defaultValue?: string;
}) {
  const router = useRouter();

  return (
    <form
      className="ml-auto flex max-w-[420px] items-center rounded-full border border-rule bg-cream py-1.5 pl-5 pr-1.5"
      onSubmit={(e) => {
        e.preventDefault();
        const input = (e.target as HTMLFormElement).querySelector("input");
        const q = input?.value?.trim() || "";
        const params = new URLSearchParams(window.location.search);
        if (q) {
          params.set("q", q);
        } else {
          params.delete("q");
        }
        params.delete("page");
        router.push(`?${params.toString()}`);
      }}
    >
      <input
        type="text"
        defaultValue={defaultValue || ""}
        placeholder={placeholder}
        className="flex-1 border-none bg-transparent py-2.5 font-body text-[15px] text-ink outline-none placeholder:text-ink-soft/50"
      />
      <button
        type="submit"
        className="rounded-full bg-forest px-5 py-3 font-display text-sm font-medium text-oatmeal"
      >
        Search
      </button>
    </form>
  );
}
