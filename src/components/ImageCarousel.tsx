"use client";

import { useState, useCallback, useEffect } from "react";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  /** Optional cover image shown first */
  cover?: string;
}

/** Simple keyboard- and touch-friendly image carousel for story galleries. */
export default function ImageCarousel({ images, alt, cover }: ImageCarouselProps) {
  const all = cover ? [cover, ...images.filter((u) => u !== cover)] : images;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => (i + dir + all.length) % all.length);
    },
    [all.length]
  );

  useEffect(() => {
    if (all.length <= 1 || paused) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [all.length, go, paused]);

  if (all.length === 0) return null;

  return (
    <div
      className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-forest text-oatmeal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {all.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url("${src}")` }}
          role="img"
          aria-label={`${alt} — image ${i + 1} of ${all.length}`}
        />
      ))}

      {all.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-ink/40 text-oatmeal backdrop-blur-sm transition-colors hover:bg-ink/60"
          >
            ←
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-ink/40 text-oatmeal backdrop-blur-sm transition-colors hover:bg-ink/60"
          >
            →
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {all.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-oatmeal/50 hover:bg-oatmeal/80"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
