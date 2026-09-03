import ImageSlot from "./ImageSlot";

interface MissionData {
  eyebrow?: string;
  heading?: string;
  paragraph1?: string;
  paragraph2?: string;
  quote?: string;
  imagePlaceholder?: string;
  imageTag?: string;
}

export default function Mission({ data }: { data?: MissionData }) {
  return (
    <section className="bg-forest py-28 md:py-36">
      <div className="container-iwacu grid grid-cols-1 items-center gap-16 md:grid-cols-2 md:gap-20">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-forest-deep text-oatmeal">
          <ImageSlot placeholder={data?.imagePlaceholder || ""} />
          <span className="absolute left-5 top-5 rounded-full bg-accent px-3.5 py-2 font-display text-xs font-semibold uppercase tracking-[0.06em] text-ink">
            {data?.imageTag}
          </span>
        </div>

        <div>
          <span className="font-display text-xs font-medium uppercase tracking-[0.14em] text-accent">
            {data?.eyebrow}
          </span>
          <h2 className="mt-5 mb-8 font-display text-[clamp(40px,5vw,68px)] font-medium leading-[1.02] tracking-[-0.03em] text-oatmeal">
            {data?.heading}
          </h2>
          <p className="mb-5 max-w-[46ch] text-xl leading-[1.55] text-oatmeal/82">
            {data?.paragraph1}
          </p>
          <p className="mb-5 max-w-[46ch] text-xl leading-[1.55] text-oatmeal/82">
            {data?.paragraph2}
          </p>
          <div className="mt-10 border-t border-rule-on-green pt-7 font-display text-sm tracking-[0.06em] text-oatmeal/70">
            {data?.quote}
          </div>
        </div>
      </div>
    </section>
  );
}
