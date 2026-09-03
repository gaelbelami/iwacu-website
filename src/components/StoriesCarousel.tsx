"use client";

import { useRef } from "react";
import ImageSlot from "./ImageSlot";

const tagStyles = {
  success: "bg-accent text-ink",
  ongoing: "bg-forest text-accent",
  default: "bg-oatmeal text-forest",
};

interface StoryItem {
  id: string;
  tag: string;
  tagVariant: string;
  imagePlaceholder: string;
  meta: string;
  title: string;
}

interface StoriesData {
  eyebrow?: string;
  heading?: string;
  headingLine2?: string;
  prevAria?: string;
  nextAria?: string;
  readAll?: string;
  items?: StoryItem[];
}

export default function StoriesCarousel({ data }: { data?: StoriesData }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    scrollerRef.current?.scrollBy({ left: dir * 560, behavior: "smooth" });
  };

  const items = data?.items || [];

  return (
    <section className="bg-oatmeal py-28 text-ink md:py-36">
      <div className="container-iwacu">
        <div className="mb-15 flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div>
            <span className="font-display text-xs font-medium uppercase tracking-[0.14em] text-forest-soft">
              {data?.eyebrow}
            </span>
            <h2 className="mt-3 max-w-[16ch] font-display text-[clamp(48px,6vw,88px)] font-medium leading-[0.98] tracking-[-0.035em] text-forest">
              {data?.heading}
              <br />
              {data?.headingLine2}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll(-1)}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-forest font-display text-[22px] text-oatmeal transition-colors hover:bg-forest-deep"
              aria-label={data?.prevAria}
            >
              ←
            </button>
            <button
              onClick={() => scroll(1)}
              className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-forest font-display text-[22px] text-oatmeal transition-colors hover:bg-forest-deep"
              aria-label={data?.nextAria}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="container-iwacu">
        <div
          ref={scrollerRef}
          className="stories-scroll -mx-[clamp(20px,4vw,56px)] flex gap-6 overflow-x-auto scroll-smooth scroll-snap-type-x-mandatory px-[clamp(20px,4vw,56px)] pb-3"
        >
          {items.map((story) => (
            <article
              key={story.id}
              className="flex w-[clamp(320px,40vw,520px)] shrink-0 snap-start flex-col gap-5"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-forest text-oatmeal">
                <ImageSlot placeholder={story.imagePlaceholder} />
                <span
                  className={`absolute left-4 top-4 rounded-full px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.1em] ${
                    tagStyles[story.tagVariant as keyof typeof tagStyles] || tagStyles.default
                  }`}
                >
                  {story.tag}
                </span>
              </div>
              <span className="font-display text-xs uppercase tracking-[0.1em] text-forest-soft/70">
                {story.meta}
              </span>
              <h3 className="font-display text-[26px] font-medium leading-[1.15] tracking-[-0.02em] text-forest">
                {story.title}
              </h3>
            </article>
          ))}
        </div>
      </div>

      <div className="container-iwacu mt-15 text-center">
        <a
          href="/stories"
          className="inline-flex items-center gap-3 rounded-full border-[1.5px] border-forest px-5 py-3.5 font-display text-[15px] font-medium text-forest transition-all hover:bg-forest hover:text-oatmeal"
        >
          {data?.readAll} <span>→</span>
        </a>
      </div>
    </section>
  );
}
