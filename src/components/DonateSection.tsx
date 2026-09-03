"use client";

import { useState } from "react";

interface DonateData {
  eyebrow?: string;
  heading?: string;
  subtext?: string;
  badge?: string;
  ein?: string;
  chooseGift?: string;
  monthly?: string;
  oneTime?: string;
  other?: string;
  amt25?: string;
  amt75?: string;
  amt150?: string;
  amt300?: string;
  amt500?: string;
  ctaMonthly?: string;
  ctaOneTime?: string;
  ctaDefault?: string;
}

export default function DonateSection({ data }: { data?: DonateData }) {
  const [isMonthly, setIsMonthly] = useState(true);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(75);

  const amounts = [
    { value: 25, label: data?.amt25 || "" },
    { value: 75, label: data?.amt75 || "" },
    { value: 150, label: data?.amt150 || "" },
    { value: 300, label: data?.amt300 || "" },
    { value: 500, label: data?.amt500 || "" },
  ];

  const ctaText = selectedAmount
    ? isMonthly
      ? (data?.ctaMonthly || "").replace("{amount}", String(selectedAmount))
      : (data?.ctaOneTime || "").replace("{amount}", String(selectedAmount))
    : data?.ctaDefault || "";

  return (
    <section id="donate" className="grid min-h-[90vh] grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-between bg-accent px-6 py-20 text-ink md:px-12 md:py-20">
        <div>
          <span className="font-display text-xs font-medium uppercase tracking-[0.14em] text-ink/60">
            {data?.eyebrow}
          </span>
          <h2 className="mt-5 font-display text-[clamp(56px,8vw,140px)] font-medium leading-[0.9] tracking-[-0.05em]">
            {data?.heading}
          </h2>
        </div>
        <p className="mt-10 max-w-[32ch] font-display text-xl leading-[1.4]">
          {data?.subtext}
        </p>
        <div className="mt-10 flex items-center gap-10 font-display text-[13px] tracking-[0.06em]">
          <span className="rounded-full bg-ink px-3.5 py-2 text-accent">
            {data?.badge}
          </span>
          <span>{data?.ein}</span>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-10 bg-forest-deep px-6 py-20 text-oatmeal md:px-12 md:py-20">
        <div>
          <span className="font-display text-[13px] uppercase tracking-[0.14em] text-oatmeal/60">
            {data?.chooseGift}
          </span>
          <div className="mt-4 flex w-fit rounded-full bg-forest p-1">
            <button
              onClick={() => setIsMonthly(true)}
              className={`rounded-full px-6 py-3 font-display text-sm font-medium transition-colors ${
                isMonthly ? "bg-accent text-ink" : "text-oatmeal/60"
              }`}
            >
              {data?.monthly}
            </button>
            <button
              onClick={() => setIsMonthly(false)}
              className={`rounded-full px-6 py-3 font-display text-sm font-medium transition-colors ${
                !isMonthly ? "bg-accent text-ink" : "text-oatmeal/60"
              }`}
            >
              {data?.oneTime}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {amounts.map((amt) => (
            <button
              key={amt.value}
              onClick={() => setSelectedAmount(amt.value)}
              className={`flex flex-col gap-2 rounded-lg border-[1.5px] px-4 py-5 text-left font-display transition-all ${
                selectedAmount === amt.value
                  ? "border-accent bg-accent text-ink"
                  : "border-rule-on-green text-oatmeal hover:border-accent hover:bg-accent hover:text-ink"
              }`}
            >
              <span className="text-[26px] font-medium">${amt.value}</span>
              <small className={`text-xs font-normal ${selectedAmount === amt.value ? "text-ink/75" : "text-oatmeal/70"}`}>
                {amt.label}
              </small>
            </button>
          ))}
          <button
            onClick={() => setSelectedAmount(null)}
            className={`flex flex-col items-start justify-center rounded-lg border-[1.5px] px-4 py-5 font-display text-[26px] font-medium transition-all ${
              selectedAmount === null
                ? "border-accent bg-accent text-ink"
                : "border-rule-on-green text-oatmeal hover:border-accent"
            }`}
          >
            {data?.other}
          </button>
        </div>

        <a
          href="#"
          className="inline-flex items-center justify-center gap-4 rounded-full bg-oatmeal px-8 py-5 text-center font-display text-xl font-semibold text-forest transition-transform hover:-translate-y-0.5"
        >
          {ctaText} <span>→</span>
        </a>
      </div>
    </section>
  );
}
