import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import { Link } from "@/i18n/navigation";
import { getStoryBySlug, getRelatedStories } from "@/services/stories";
import ImageCarousel from "@/components/ImageCarousel";

const tagStyles: Record<string, string> = {
  success: "bg-forest text-accent",
  ongoing: "bg-accent text-ink",
  voices: "bg-oatmeal text-forest",
  field: "bg-cream text-forest border border-forest",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const story = await getStoryBySlug(slug, locale as "en" | "fr");

  if (!story) return { title: "Story not found" };

  return {
    title: story.title,
    description: story.excerpt,
  };
}

export default async function StoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const story = await getStoryBySlug(slug, locale as "en" | "fr");

  if (!story) notFound();

  const relatedStories = await getRelatedStories(slug, locale as "en" | "fr", 3);

  const publishedDate = story.publishedAt
    ? new Date(story.publishedAt).toLocaleDateString(
        locale === "fr" ? "fr-FR" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    : "";

  return (
    <main className="bg-oatmeal text-ink">
      <Nav variant="light" />

      {/* ── Back link ──────────────────────────── */}
      <div className="container-iwacu pt-8 pb-4">
        <Link
          href="/stories"
          className="inline-flex items-center gap-2 font-display text-sm font-medium text-forest/70 transition-colors hover:text-forest"
        >
          <span>←</span>
          <span>{locale === "fr" ? "Toutes les histoires" : "All Stories"}</span>
        </Link>
      </div>

      {/* ── Header ───────────────────────────── */}
      <header className="container-iwacu pb-12">
        <div className="max-w-3xl">
          {/* Tag */}
          <span
            className={`inline-block rounded-full px-3 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.1em] ${
              tagStyles[story.tagVariant] || tagStyles.voices
            }`}
          >
            {story.tag}
          </span>

          {/* Title */}
          <h1 className="mt-6 font-display text-[clamp(40px,5vw,72px)] font-medium leading-[1.02] tracking-[-0.035em] text-forest">
            {story.title}
          </h1>

          {/* Excerpt */}
          {story.excerpt && (
            <p className="mt-6 max-w-[56ch] text-xl leading-[1.55] text-ink-soft">
              {story.excerpt}
            </p>
          )}

          {/* Meta bar */}
          <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-rule pt-8 font-display text-[13px] tracking-[0.06em] text-forest-soft">
            {story.authorInitials && (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest font-display text-sm font-semibold text-accent">
                {story.authorInitials}
              </span>
            )}
            <div>
              {story.authorName && (
                <div className="text-forest">{story.authorName}</div>
              )}
              <div className="mt-1 text-forest-soft/60">
                {publishedDate}
                {story.readTime && ` · ${story.readTime} min read`}
              </div>
            </div>
            {story.location && (
              <>
                <span className="text-forest-soft/30">|</span>
                <span className="text-forest-soft">{story.location}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Featured Image / Gallery carousel ── */}
      {story.gallery && story.gallery.length > 0 ? (
        <div className="container-iwacu pb-12">
          <ImageCarousel
            images={story.gallery}
            cover={
              story.imagePlaceholder?.startsWith("http") || story.imagePlaceholder?.startsWith("//")
                ? story.imagePlaceholder
                : undefined
            }
            alt={story.title}
          />
        </div>
      ) : (
        story.imagePlaceholder &&
        (story.imagePlaceholder.startsWith("http") || story.imagePlaceholder.startsWith("//")) && (
          <div className="container-iwacu pb-12">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-forest text-oatmeal">
              <ImageSlot placeholder={story.imagePlaceholder} alt={story.title} />
            </div>
          </div>
        )
      )}

      {/* ── Body ──────────────────────────────── */}
      <article className="container-iwacu pb-28">
        <div className="mx-auto max-w-2xl">
          {story.body ? (
            <div className="font-body text-lg leading-[1.7] text-ink-soft whitespace-pre-line">
              {story.body}
            </div>
          ) : (
            <p className="font-body text-lg leading-[1.7] text-ink-soft/50 italic">
              {locale === "fr"
                ? "Le contenu complet de cette histoire sera bientôt disponible."
                : "Full story content coming soon."}
            </p>
          )}
        </div>
      </article>

      {/* ── Related stories ───────────────────── */}
      {relatedStories.length > 0 && (
        <section className="border-t border-rule bg-cream py-20">
          <div className="container-iwacu">
            <h2 className="mb-10 font-display text-sm font-medium uppercase tracking-[0.14em] text-forest-soft">
              {locale === "fr" ? "Histoires associées" : "Related Stories"}
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
              {relatedStories.map((related) => (
                <Link
                  key={related.id}
                  href={`/stories/${related.slug}`}
                  className="group flex cursor-pointer flex-col gap-4"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded bg-forest text-oatmeal transition-transform duration-300 group-hover:-translate-y-1">
                    <ImageSlot placeholder={related.imagePlaceholder} />
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.1em] ${
                        tagStyles[related.tagVariant] || tagStyles.voices
                      }`}
                    >
                      {related.tag}
                    </span>
                  </div>
                  <span className="flex items-center gap-3 font-display text-xs uppercase tracking-[0.08em] text-forest-soft">
                    <span className="h-px w-3 bg-forest-soft" />
                    {related.meta}
                  </span>
                  <h4 className="font-display text-[22px] font-medium leading-[1.15] tracking-[-0.015em] text-forest">
                    {related.title}
                  </h4>
                  {related.excerpt && (
                    <p className="text-sm leading-[1.5] text-ink-soft">
                      {related.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer variant="light" />
    </main>
  );
}
