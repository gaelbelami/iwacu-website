interface HeroData {
  word1?: string;
  word2?: string;
  word3?: string;
  label1?: string;
  text1?: string;
  label2?: string;
  text2?: string;
  ctaText?: string;
  ctaSubtext?: string;
  statusText?: string;
  dateRange?: string;
}

export default function Hero({ data }: { data?: HeroData }) {
  const words = [
    { text: data?.word1 || "", variant: "normal" as const },
    { text: data?.word2 || "", variant: "accent" as const },
    { text: data?.word3 || "", variant: "outline" as const },
  ];

  const bottomItems = [
    { label: data?.label1 || "", text: data?.text1 || "" },
    { label: data?.label2 || "", text: data?.text2 || "" },
  ];

  return (
    <section className="relative flex min-h-[92vh] flex-col justify-between bg-forest py-16 text-oatmeal">
      <div className="container-iwacu flex items-start justify-between font-display text-[13px] tracking-[0.06em] text-oatmeal/70">
        <span className="inline-flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-accent" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          {data?.statusText}
        </span>
        <span className="hidden sm:inline">{data?.dateRange}</span>
      </div>

      <div className="container-iwacu py-10">
        <h1 className="font-display text-[clamp(64px,15vw,240px)] font-medium leading-[0.88] tracking-[-0.055em]">
          {words.map((word, i) => (
            <span
              key={i}
              className={`block ${
                word.variant === "accent"
                  ? "text-accent"
                  : word.variant === "outline"
                    ? "text-stroke-oatmeal"
                    : ""
              }`}
            >
              {word.text}
            </span>
          ))}
        </h1>
      </div>

      <div className="container-iwacu grid grid-cols-1 gap-10 border-t border-rule-on-green pt-10 md:grid-cols-3 md:items-end">
        {bottomItems.map((item, i) => (
          <div key={i}>
            <span className="mb-3 block font-display text-xs uppercase tracking-[0.14em] text-oatmeal/55">
              {item.label}
            </span>
            <span className="block max-w-[30ch] font-display text-xl leading-[1.3] tracking-[-0.01em]">
              {item.text}
            </span>
          </div>
        ))}

        <div className="flex flex-col items-start gap-3.5">
          <a
            href="#donate"
            className="inline-flex items-center gap-4 rounded-full bg-accent px-8 py-5 font-display text-xl font-semibold tracking-[-0.01em] text-ink transition-all hover:-translate-y-0.5 hover:bg-accent-soft"
          >
            {data?.ctaText} <span>→</span>
          </a>
          <span className="font-display text-xs tracking-[0.1em] text-oatmeal/60">
            {data?.ctaSubtext}
          </span>
        </div>
      </div>
    </section>
  );
}
