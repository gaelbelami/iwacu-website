import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Footer({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const t = await getTranslations("footer");
  const isDark = variant === "dark";

  const columns = [
    { title: t("col1Title"), links: [t("col1Link1"), t("col1Link2"), t("col1Link3"), t("col1Link4")] },
    { title: t("col2Title"), links: [t("col2Link1"), t("col2Link2"), t("col2Link3"), t("col2Link4")] },
    { title: t("col3Title"), links: [t("col3Link1"), t("col3Link2"), t("col3Link3"), t("col3Link4")] },
  ];

  return (
    <footer
      className={`pt-20 pb-10 border-t ${
        isDark
          ? "bg-forest text-oatmeal border-rule-on-green"
          : "bg-oatmeal text-forest border-rule"
      }`}
    >
      <div className="container-iwacu">
        <div
          className={`grid grid-cols-1 gap-12 pb-15 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-15 border-b ${
            isDark ? "border-rule-on-green" : "border-rule"
          }`}
        >
          <div>
            <Image
              src={isDark ? "/images/icc-light.svg" : "/images/icc-dark.svg"}
              alt="Iwacu Collective Center"
              width={160}
              height={57}
            />
            <h3 className="mt-5 mb-6 max-w-[20ch] font-display text-[26px] font-medium leading-[1.1] tracking-[-0.02em]">
              {t("brandHeading")}
            </h3>
            <p className={`max-w-[32ch] text-sm ${isDark ? "text-oatmeal/75" : "text-ink-soft"}`}>
              {t("brandText")}
            </p>
          </div>

          {columns.map((col, i) => (
            <div key={i}>
              <h4
                className={`mb-5 font-display text-xs uppercase tracking-[0.14em] ${
                  isDark ? "text-oatmeal/60" : "text-forest-soft"
                }`}
              >
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.includes("@") ? `mailto:${link}` : "#"}
                      className={`text-[15px] transition-colors ${
                        isDark ? "hover:text-accent" : "hover:text-forest"
                      }`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className={`flex flex-col items-start justify-between gap-4 pt-8 font-display text-xs tracking-[0.06em] md:flex-row md:items-center ${
            isDark ? "text-oatmeal/50" : "text-forest-soft"
          }`}
        >
          <span>{t("legal")}</span>
          <span>{t("legalLinks")}</span>
        </div>
      </div>

      {isDark && (
        <div className="container-iwacu mt-15 text-center leading-none">
          <svg
            viewBox="0 0 1000 240"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto w-full max-w-[1200px] text-oatmeal"
            aria-hidden="true"
          >
            <path
              d="M 250 80 Q 500 -40 750 80"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <text
              x="500"
              y="200"
              fontFamily="Space Grotesk, sans-serif"
              fontSize="220"
              fontWeight="500"
              textAnchor="middle"
              fill="currentColor"
              letterSpacing="-8"
            >
              iwacu
            </text>
          </svg>
        </div>
      )}
    </footer>
  );
}
