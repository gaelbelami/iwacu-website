interface WorkItem {
  number: string;
  title: string;
  description: string;
}

interface WorkData {
  eyebrow?: string;
  heading?: string;
  headingAccent?: string;
  items?: WorkItem[];
}

export default function WorkSection({ data }: { data?: WorkData }) {
  const items = data?.items || [];

  return (
    <section id="work" className="bg-oatmeal py-28 text-ink md:py-36">
      <div className="container-iwacu">
        <div className="mb-15 max-w-[800px]">
          <span className="font-display text-xs font-medium uppercase tracking-[0.14em] text-forest-soft">
            {data?.eyebrow}
          </span>
          <h2 className="mt-3 font-display text-[clamp(48px,7vw,108px)] font-medium leading-[0.95] tracking-[-0.04em] text-forest">
            {data?.heading}
            <br />
            <span className="text-accent">{data?.headingAccent}</span>
          </h2>
        </div>

        <div className="flex flex-col">
          {items.map((item, i) => (
            <a
              key={i}
              href="#"
              className={`group grid grid-cols-[60px_1fr_40px] items-center gap-6 border-t border-rule py-8 transition-all hover:bg-forest/[0.08] hover:px-6 md:grid-cols-[100px_1fr_2fr_100px] md:gap-10 ${
                i === items.length - 1 ? "border-b" : ""
              }`}
            >
              <span className="font-display text-lg font-medium text-forest-soft/60">
                {item.number}
              </span>
              <span className="font-display text-[clamp(28px,3.5vw,48px)] font-medium leading-none tracking-[-0.025em] text-forest">
                {item.title}
              </span>
              <span className="hidden max-w-[52ch] text-base leading-[1.55] text-ink-soft md:block">
                {item.description}
              </span>
              <span className="justify-self-end font-display text-3xl text-forest transition-transform group-hover:translate-x-1.5">
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
