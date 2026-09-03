interface UrgentBandData {
  text?: string;
}

export default function UrgentBand({ data }: { data?: UrgentBandData }) {
  const text = data?.text || "";
  const repeatCount = 4;
  const items = Array.from({ length: repeatCount });

  return (
    <div className="overflow-hidden whitespace-nowrap bg-accent py-6 font-display font-medium text-ink">
      <div className="flex animate-marquee gap-15 text-[22px] tracking-[-0.01em]">
        {items.map((_, i) => (
          <span key={i} className="flex shrink-0 items-center gap-15">
            {text}
            <span className="inline-block h-2.5 w-2.5 rotate-45 bg-ink" />
          </span>
        ))}
        {items.map((_, i) => (
          <span key={`dup-${i}`} className="flex shrink-0 items-center gap-15">
            {text}
            <span className="inline-block h-2.5 w-2.5 rotate-45 bg-ink" />
          </span>
        ))}
      </div>
    </div>
  );
}
