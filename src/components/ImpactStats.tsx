interface StatItem {
  kicker: string;
  number: string;
  suffix?: string;
  label: string;
}

interface ImpactSectionData {
  heading?: string;
  headingLine2?: string;
  description?: string;
  items?: StatItem[];
}

export default function ImpactStats({ data }: { data?: ImpactSectionData }) {
  const stats = data?.items || [];

  return (
    <section id="impact" className="bg-forest-deep py-28 text-oatmeal md:py-36">
      <div className="container-iwacu">
        <div className="mb-20 flex flex-col gap-15 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[16ch] font-display text-[clamp(48px,6vw,88px)] font-medium leading-[0.98] tracking-[-0.035em]">
            {data?.heading}
            <br />
            {data?.headingLine2}
          </h2>
          <p className="max-w-[32ch] text-right text-[15px] text-oatmeal/70 md:text-right">
            {data?.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px border border-rule-on-green bg-rule-on-green md:grid-cols-2">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex min-h-[260px] flex-col justify-between bg-forest-deep px-10 py-12"
            >
              <span className="font-display text-xs uppercase tracking-[0.14em] text-oatmeal/50">
                {stat.kicker}
              </span>
              <span className="font-display text-[clamp(80px,12vw,180px)] font-medium leading-[0.9] tracking-[-0.05em] text-accent">
                {stat.number}
                {stat.suffix && (
                  <sup className="relative -top-[1em] ml-2 text-[0.35em] text-oatmeal">
                    {stat.suffix}
                  </sup>
                )}
              </span>
              <span className="max-w-[32ch] font-display text-lg tracking-[-0.005em] text-oatmeal">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
