import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import UrgentBand from "@/components/UrgentBand";
import Mission from "@/components/Mission";
import WorkSection from "@/components/WorkSection";
import ImpactStats from "@/components/ImpactStats";
import StoriesCarousel from "@/components/StoriesCarousel";
import DonateSection from "@/components/DonateSection";
import Footer from "@/components/Footer";
import { getHomepageData } from "@/services/homepage";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const data = await getHomepageData(locale as "en" | "fr");

  return (
    <main className="bg-forest text-oatmeal">
      <Nav />
      <Hero data={data.hero} />
      <UrgentBand data={data.urgentBand} />
      <Mission data={data.mission} />
      <WorkSection data={data.work} />
      <ImpactStats data={{ ...data.impact, items: data.impactStats }} />
      <StoriesCarousel data={data.stories} />
      <DonateSection data={data.donate} />
      <Footer />
    </main>
  );
}
