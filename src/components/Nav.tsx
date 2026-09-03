"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";

export default function Nav({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const isDark = variant === "dark";

  const navLinks = [
    { label: t("work"), href: "/#work" },
    { label: t("about"), href: "/about" },
    { label: t("stories"), href: "/stories" },
    { label: t("impact"), href: "/#impact" },
  ];

  const otherLocale = locale === "en" ? "fr" : "en";

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-xl border-b ${
        isDark
          ? "bg-[color:color-mix(in_oklab,var(--color-forest)_90%,transparent)] border-rule-on-green"
          : "bg-[color:color-mix(in_oklab,var(--color-oatmeal)_92%,transparent)] border-rule"
      }`}
    >
      <div className="container-iwacu flex items-center justify-between py-[18px]">
        <Link href="/">
          <Image
            src={isDark ? "/images/icc-light.svg" : "/images/icc-dark.svg"}
            alt="Iwacu Collective Center"
            width={140}
            height={50}
            priority
          />
        </Link>

        <div
          className={`hidden md:flex gap-9 font-display text-[15px] font-medium ${
            isDark ? "text-oatmeal" : "text-forest"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors ${
                isDark ? "hover:text-oatmeal/70" : "hover:text-forest-soft"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={pathname}
            locale={otherLocale}
            className={`font-display text-[13px] font-medium tracking-[0.06em] uppercase transition-colors ${
              isDark ? "text-oatmeal hover:text-accent" : "text-forest hover:text-accent"
            }`}
          >
            {otherLocale === "en" ? "EN" : "FR"}
          </Link>
          <span
            className={`font-display text-[13px] font-medium tracking-[0.06em] ${
              isDark ? "text-oatmeal/40" : "text-forest/40"
            }`}
          >
            ·
          </span>
          <span
            className={`font-display text-[13px] font-medium tracking-[0.06em] uppercase ${
              isDark ? "text-oatmeal/40" : "text-forest/40"
            }`}
          >
            {locale === "en" ? "EN" : "FR"}
          </span>
          <Link
            href="/#donate"
            className="inline-flex items-center gap-3 rounded-full bg-accent px-5 py-3 font-display text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 hover:bg-accent-soft"
          >
            {t("donate")} <span>→</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
