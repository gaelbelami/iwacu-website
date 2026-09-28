import { getTranslations } from "next-intl/server";
import Nav from "@/components/Nav";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import SearchForm from "@/components/SearchForm";
import SortSelect from "@/components/SortSelect";
import NewsletterForm from "@/components/NewsletterForm";
import { getPublishedStories } from "@/services/stories";

const tagStyles: Record<string, string> = {
  success: "bg-forest text-accent",
  ongoing: "bg-accent text-ink",
  voices: "bg-oatmeal text-forest",
  field: "bg-cream text-forest border border-forest",
};

export default async function StoriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string; sort?: string; q?: string; page?: string }>;
}) {
  const { locale } = await params;
  const { tag: activeTag, sort: activeSort, q: searchQuery, page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const t = await getTranslations("storiesPage");
  const allStories = await getPublishedStories(locale as "en" | "fr");

  // ── Compute real counts per tag ──────────────
  const counts = { all: 0, success: 0, ongoing: 0, voices: 0, field: 0 };
  if (allStories) {
    counts.all = allStories.length;
    for (const s of allStories) {
      const v = s.tagVariant as keyof typeof counts;
      if (v in counts && v !== "all") counts[v]++;
    }
  }

  // ── Filter ────────────────────────────────────
  let filtered = allStories ? [...allStories] : null;

  if (filtered && activeTag) {
    filtered = filtered.filter((s) => s.tagVariant === activeTag);
  }

  if (filtered && searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.excerpt.toLowerCase().includes(q) ||
        s.body.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.authorName.toLowerCase().includes(q)
    );
  }

  // ── Sort ──────────────────────────────────────
  if (filtered) {
    switch (activeSort) {
      case "read":
        filtered.sort((a, b) => (b.readTime || 0) - (a.readTime || 0));
        break;
      case "region":
        filtered.sort((a, b) => (a.location || "zzz").localeCompare(b.location || "zzz"));
        break;
      default:
        // "recent" — already sorted by published_at desc from the service
        break;
    }
  }

  const isFiltered = !!activeTag || !!searchQuery || !!activeSort;

  // ── Featured story (only on default view) ─────
  const featuredStory = !isFiltered
    ? (filtered?.find((s) => s.isFeatured)
      || filtered?.[0]
      || null)
    : null;

  const translationFallback = !featuredStory && !isFiltered
    ? {
        id: "featured",
        tag: t("featuredTag"),
        tagVariant: "success",
        imagePlaceholder: t("featuredImg"),
        meta: t("featuredDate"),
        title: t("featuredTitle"),
        excerpt: t("featuredExcerpt"),
      }
    : null;

  const displayFeatured = featuredStory || translationFallback;

  // ── Grid stories (exclude featured) ───────────
  const gridStories = filtered
    ? (displayFeatured && !isFiltered
        ? filtered.filter((s) => s.id !== displayFeatured.id)
        : filtered)
    : null;

  const recentStories = gridStories
    ? (isFiltered ? gridStories : gridStories.slice(0, 6))
    : [
        { id: "n1", tag: t("recent1Tag"), tagVariant: "ongoing", imagePlaceholder: t("recent1Img"), meta: t("recent1Meta"), title: t("recent1Title"), excerpt: t("recent1Excerpt") },
        { id: "n2", tag: t("recent2Tag"), tagVariant: "voices", imagePlaceholder: t("recent2Img"), meta: t("recent2Meta"), title: t("recent2Title"), excerpt: t("recent2Excerpt") },
        { id: "n3", tag: t("recent3Tag"), tagVariant: "success", imagePlaceholder: t("recent3Img"), meta: t("recent3Meta"), title: t("recent3Title"), excerpt: t("recent3Excerpt") },
        { id: "n4", tag: t("recent4Tag"), tagVariant: "ongoing", imagePlaceholder: t("recent4Img"), meta: t("recent4Meta"), title: t("recent4Title"), excerpt: t("recent4Excerpt") },
        { id: "n5", tag: t("recent5Tag"), tagVariant: "field", imagePlaceholder: t("recent5Img"), meta: t("recent5Meta"), title: t("recent5Title"), excerpt: t("recent5Excerpt") },
        { id: "n6", tag: t("recent6Tag"), tagVariant: "success", imagePlaceholder: t("recent6Img"), meta: t("recent6Meta"), title: t("recent6Title"), excerpt: t("recent6Excerpt") },
      ];

  const earlierStories = gridStories
    ? gridStories.slice(6, 6 + currentPage * 6)
    : [
        { id: "e1", tag: t("earlier1Tag"), tagVariant: "voices", imagePlaceholder: t("earlier1Img"), meta: t("earlier1Meta"), title: t("earlier1Title"), excerpt: t("earlier1Excerpt") },
        { id: "e2", tag: t("earlier2Tag"), tagVariant: "success", imagePlaceholder: t("earlier2Img"), meta: t("earlier2Meta"), title: t("earlier2Title"), excerpt: t("earlier2Excerpt") },
        { id: "e3", tag: t("earlier3Tag"), tagVariant: "field", imagePlaceholder: t("earlier3Img"), meta: t("earlier3Meta"), title: t("earlier3Title"), excerpt: t("earlier3Excerpt") },
      ];

  // ── Pagination: reveal 6 "earlier" stories per page ──
  const earlierPoolSize = gridStories ? Math.max(0, gridStories.length - 6) : 0;
  const hasMore = !isFiltered && earlierPoolSize > currentPage * 6;
  const loadMoreParams = new URLSearchParams();
  if (activeTag) loadMoreParams.set("tag", activeTag);
  if (activeSort && activeSort !== "recent") loadMoreParams.set("sort", activeSort);
  if (searchQuery) loadMoreParams.set("q", searchQuery);
  loadMoreParams.set("page", String(currentPage + 1));
  const loadMoreHref = `?${loadMoreParams.toString()}`;

  // ── Filter button config ──────────────────────
  const filters = [
    { label: t("filterAll"), count: counts.all, value: "" },
    { label: t("filterSuccess"), count: counts.success, value: "success" },
    { label: t("filterOngoing"), count: counts.ongoing, value: "ongoing" },
    { label: t("filterVoices"), count: counts.voices, value: "voices" },
    { label: t("filterField"), count: counts.field, value: "field" },
  ];

  const sortOptions = [
    { value: "recent", label: t("sortRecent") },
    { value: "read", label: t("sortRead") },
    { value: "region", label: t("sortRegion") },
  ];

  return (
    <main className="bg-oatmeal text-ink">
      <Nav variant="light" />

      {/* ── Header ───────────────────────────── */}
      <section className="border-b border-rule pb-10 pt-20 md:pt-24">
        <div className="container-iwacu">
          <div className="mb-7 flex justify-between font-display text-xs uppercase tracking-[0.14em] text-forest/70">
            <span>{t("topLabel")}</span>
            <span>{t("topMeta")}</span>
          </div>
          <h1 className="max-w-[14ch] font-display text-[clamp(56px,8vw,128px)] font-medium leading-[0.94] tracking-[-0.035em] text-forest">
            {t("heading")}
            <br />
            <em className="font-serif italic font-normal text-forest-soft">
              {t("headingItalic")}
            </em>
          </h1>

          <div className="mt-10 grid grid-cols-1 items-end gap-15 md:grid-cols-[1.2fr_1fr]">
            <p className="max-w-[44ch] text-[19px] leading-[1.55] text-ink-soft">
              {t("description")}
            </p>
            <SearchForm placeholder={t("searchPlaceholder")} defaultValue={searchQuery} />
          </div>
        </div>
      </section>

      {/* ── Filter bar ───────────────────────── */}
      <div className="border-b border-rule py-8">
        <div className="container-iwacu flex flex-wrap items-center justify-between gap-5">
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => {
              const isActive = (f.value === "" && !activeTag) || f.value === activeTag;
              const href = f.value ? `?tag=${f.value}` : "?";
              return (
                <Link
                  key={f.value || "all"}
                  href={href}
                  className={`rounded-full border px-[18px] py-2.5 font-display text-sm font-medium transition-all ${
                    isActive
                      ? "border-forest bg-forest text-oatmeal"
                      : "border-rule text-forest hover:border-forest"
                  }`}
                >
                  {f.label}{" "}
                  <span className="ml-1.5 text-[11px] opacity-70">{f.count}</span>
                </Link>
              );
            })}
          </div>
          <SortSelect label={t("sortBy")} options={sortOptions} defaultValue={activeSort || "recent"} />
        </div>
      </div>

      {/* ── Active filters indicator ────────── */}
      {isFiltered && (
        <div className="container-iwacu pt-8">
          <div className="flex items-center gap-3 font-display text-sm text-forest-soft">
            {searchQuery && (
              <span className="rounded-full bg-cream px-3 py-1 text-forest">
                &ldquo;{searchQuery}&rdquo;
              </span>
            )}
            {activeTag && (
              <span className="rounded-full bg-cream px-3 py-1 text-forest">
                {filters.find((f) => f.value === activeTag)?.label || activeTag}
              </span>
            )}
            <span className="text-forest-soft/60">
              {gridStories ? gridStories.length : 0} {gridStories && gridStories.length === 1 ? "result" : "results"}
            </span>
            <Link href="?" className="ml-auto text-forest underline underline-offset-2 hover:no-underline">
              Clear filters
            </Link>
          </div>
        </div>
      )}

      {/* ── Featured story (only on default view) ── */}
      {displayFeatured && !isFiltered && (
        <section className="py-15">
          <div className="container-iwacu">
            <div className={`grid grid-cols-1 items-center gap-15 ${displayFeatured.imagePlaceholder?.startsWith("http") || displayFeatured.imagePlaceholder?.startsWith("//") ? "md:grid-cols-[1.4fr_1fr]" : ""}`}>
              {(displayFeatured.imagePlaceholder?.startsWith("http") || displayFeatured.imagePlaceholder?.startsWith("//")) && (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-forest text-oatmeal">
                  <ImageSlot placeholder={displayFeatured.imagePlaceholder} />
                  <span className="absolute left-5 top-5 rounded-full bg-accent px-3.5 py-2 font-display text-xs font-semibold uppercase tracking-[0.1em] text-ink">
                    {displayFeatured.tag}
                  </span>
                </div>
              )}
              <div>
                <span className="font-display text-xs font-medium uppercase tracking-[0.14em] text-forest-soft">
                  {t("featuredEyebrow")}
                </span>
                <h2 className="my-4 font-display text-[clamp(36px,4.5vw,60px)] font-medium leading-[1.05] tracking-[-0.025em] text-forest">
                  {displayFeatured.title}
                </h2>
                <p className="mb-6 max-w-[46ch] text-lg leading-[1.55] text-ink-soft">
                  {displayFeatured.excerpt}
                </p>
                <div className="flex max-w-[46ch] items-center gap-5 border-t border-rule pt-5 font-display text-[13px] tracking-[0.06em] text-forest-soft">
                  {(displayFeatured as any).authorInitials ? (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest font-display text-sm font-semibold text-accent">
                      {(displayFeatured as any).authorInitials}
                    </span>
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest font-display text-sm font-semibold text-accent">
                      {t("featuredAuthor")}
                    </span>
                  )}
                  <div>
                    <div className="text-forest">
                      {(displayFeatured as any).authorName || t("featuredAuthorLine")}
                    </div>
                    <div className="mt-0.5 text-forest-soft/60">
                      {displayFeatured.meta}
                      {(displayFeatured as any).readTime && ` · ${(displayFeatured as any).readTime} min read`}
                    </div>
                  </div>
                  <Link
                    href={`/stories/${(displayFeatured as any).slug || "#"}`}
                    className="ml-auto rounded-full border-[1.5px] border-forest px-[18px] py-2.5 text-[13px] font-medium text-forest transition-all hover:bg-forest hover:text-oatmeal"
                  >
                    {t("readLink")} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Story grids ──────────────────────── */}
      <section className={`${isFiltered ? "pt-10" : ""} pb-28`}>
        <div className="container-iwacu">
          {!isFiltered && (
            <h3 className="mb-10 border-b border-rule pb-5 font-display text-sm font-medium uppercase tracking-[0.14em] text-forest-soft">
              {t("recentHeading")}
            </h3>
          )}
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {recentStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {earlierStories.length > 0 && !isFiltered && (
            <>
              <h3 className="mb-10 mt-24 border-b border-rule pb-5 font-display text-sm font-medium uppercase tracking-[0.14em] text-forest-soft">
                {t("earlierHeading")}
              </h3>
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {earlierStories.map((story) => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </div>
            </>
          )}

          {gridStories && gridStories.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-display text-lg text-forest-soft">
                {searchQuery
                  ? `No stories found for "${searchQuery}"`
                  : "No stories in this category yet."}
              </p>
              <Link
                href="?"
                className="mt-4 inline-block rounded-full border-[1.5px] border-forest px-6 py-3 font-display text-sm font-medium text-forest transition-all hover:bg-forest hover:text-oatmeal"
              >
                View all stories
              </Link>
            </div>
          )}

          {hasMore && (
            <div className="mt-20 flex justify-center">
              <Link
                href={loadMoreHref}
                className="inline-flex items-center gap-3 rounded-full border-[1.5px] border-forest px-6 py-3.5 font-display text-[15px] font-medium text-forest transition-all hover:bg-forest hover:text-oatmeal"
              >
                {t("loadMore")} <span>↓</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter strip ─────────────────── */}
      <section className="bg-forest py-20 text-oatmeal">
        <div className="container-iwacu grid grid-cols-1 items-center gap-15 md:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="font-display text-xs font-medium uppercase tracking-[0.14em] text-accent">
              {t("newsletterEyebrow")}
            </span>
            <h2 className="mt-5 max-w-[16ch] font-display text-[clamp(36px,4.5vw,56px)] font-medium leading-none tracking-[-0.03em]">
              {t("newsletterHeading")}{" "}
              <em className="font-serif italic font-normal text-accent">
                {t("newsletterHeadingItalic")}
              </em>
            </h2>
            <p className="mt-5 max-w-[40ch] text-base text-oatmeal/82">
              {t("newsletterDescription")}
            </p>
          </div>
          <NewsletterForm
            placeholder={t("newsletterPlaceholder")}
            buttonText={t("newsletterButton")}
          />
        </div>
      </section>

      <Footer variant="light" />
    </main>
  );
}

/* ── Story Card sub-component ──────────────── */
function StoryCard({
  story,
}: {
  story: {
    slug?: string;
    tag: string;
    tagVariant: string;
    imagePlaceholder: string;
    meta: string;
    title: string;
    excerpt: string;
  };
}) {
  return (
    <Link href={`/stories/${(story as any).slug || "#"}`} className="group flex cursor-pointer flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-forest text-oatmeal transition-transform duration-300 group-hover:-translate-y-1">
        <ImageSlot placeholder={story.imagePlaceholder} />
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.1em] ${
            tagStyles[story.tagVariant] || tagStyles.voices
          }`}
        >
          {story.tag}
        </span>
      </div>
      <span className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.08em] text-forest-soft">
        <span className="h-px w-3 bg-forest-soft" />
        {story.meta}
      </span>
      <h4 className="font-display text-[22px] font-medium leading-[1.15] tracking-[-0.015em] text-forest">
        {story.title}
      </h4>
      <p className="text-sm leading-[1.5] text-ink-soft">{story.excerpt}</p>
    </Link>
  );
}
