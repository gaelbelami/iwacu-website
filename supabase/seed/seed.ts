/* ═══════════════════════════════════════════════════════════
   Seed script — syncs translation content into Supabase.
   Run after applying migrations:
     npx tsx supabase/seed/seed.ts

   SAFETY RULES (important!):
   - team_members is NEVER touched here. Real team members,
     names and photos are managed exclusively through the admin
     panel (Supabase). The fictional 2018–2026 members from the
     original seed were removed on 2026-08-07.
   - timeline_events rows are deleted (the previous 2018–2026
     milestones were placeholder fiction; the section is hidden
     on the About page until real milestones exist).
   - Legacy fictional stories are deleted by id, then replaced
     with honest founding-story articles drawn from the Vision
     ICC document.
   ═══════════════════════════════════════════════════════════ */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://127.0.0.1:54321";
const key =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";

if (!key) {
  console.error(
    "Missing SUPABASE_SECRET_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  );
  process.exit(1);
}

const supabase = createClient(url, key);

// Load translations
const en = JSON.parse(
  readFileSync(join(__dirname, "../../src/messages/en.json"), "utf-8")
);
const fr = JSON.parse(
  readFileSync(join(__dirname, "../../src/messages/fr.json"), "utf-8")
);

async function upsert(table: string, data: Record<string, unknown>[]) {
  const { error } = await supabase.from(table).upsert(data, {
    onConflict: "id",
    ignoreDuplicates: false,
  });
  if (error) console.error(`  ✗ ${table}:`, error.message);
  else console.log(`  ✓ ${table}: ${data.length} row(s)`);
}

async function removeRows(table: string, ids: string[]) {
  if (ids.length === 0) return;
  const { error } = await supabase.from(table).delete().in("id", ids);
  if (error) console.error(`  ✗ ${table} delete:`, error.message);
  else console.log(`  ✓ ${table}: removed ${ids.length} legacy row(s)`);
}

async function seed() {
  console.log("🌱 Seeding database...\n");

  // ─── Site Settings ──────────────────────────────────────
  await upsert("site_settings", [
    {
      id: "00000000-0000-0000-0000-000000000001",
      site_name: "Iwacu Collective Center",
      email: "iwacucollective@gmail.com",
      locations: [{ city: "Bujumbura", country: "Burundi", is_hq: true }],
      legal_name: "IWACU COLLECTIVE CENTER",
      // No registration number yet — the organization is in formation.
      registration_number: "",
      content: {
        en: {
          nav: en.nav,
          footer: en.footer,
          meta: en.meta,
        },
        fr: {
          nav: fr.nav,
          footer: fr.footer,
          meta: fr.meta,
        },
      },
    },
  ]);

  // ─── Homepage ───────────────────────────────────────────
  await upsert("homepage", [
    {
      id: "00000000-0000-0000-0000-000000000001",
      hero: {
        en: en.hero,
        fr: fr.hero,
      },
      urgent_band: {
        en: en.urgentBand,
        fr: fr.urgentBand,
      },
      mission: {
        en: en.mission,
        fr: fr.mission,
      },
      impact: {
        en: { heading: en.impact.heading, headingLine2: en.impact.headingLine2, description: en.impact.description },
        fr: { heading: fr.impact.heading, headingLine2: fr.impact.headingLine2, description: fr.impact.description },
      },
      donate: {
        en: en.donate,
        fr: fr.donate,
      },
      footer_content: {
        en: en.footer,
        fr: fr.footer,
      },
    },
  ]);

  // ─── Work Programs (three umbrellas over the nine pillars) ──
  await upsert("work_programs", [
    {
      id: "10000000-0000-0000-0000-000000000001",
      sort_order: 1,
      title: { en: en.work.title1, fr: fr.work.title1 },
      description: { en: en.work.desc1, fr: fr.work.desc1 },
    },
    {
      id: "10000000-0000-0000-0000-000000000002",
      sort_order: 2,
      title: { en: en.work.title2, fr: fr.work.title2 },
      description: { en: en.work.desc2, fr: fr.work.desc2 },
    },
    {
      id: "10000000-0000-0000-0000-000000000003",
      sort_order: 3,
      title: { en: en.work.title3, fr: fr.work.title3 },
      description: { en: en.work.desc3, fr: fr.work.desc3 },
    },
  ]);

  // ─── Impact Stats — the crisis, in sourced numbers ──────
  // (WHO 2025, UN Women 2026, World Bank 2023, MFFPS 2026 —
  //  all figures taken from the Vision ICC document.)
  await upsert("impact_stats", [
    { id: "20000000-0000-0000-0000-000000000001", sort_order: 1, kicker: { en: en.impact.kicker1, fr: fr.impact.kicker1 }, number: en.impact.number1, suffix: en.impact.suffix1 || "", label: { en: en.impact.label1, fr: fr.impact.label1 } },
    { id: "20000000-0000-0000-0000-000000000002", sort_order: 2, kicker: { en: en.impact.kicker2, fr: fr.impact.kicker2 }, number: en.impact.number2, suffix: en.impact.suffix2 || "", label: { en: en.impact.label2, fr: fr.impact.label2 } },
    { id: "20000000-0000-0000-0000-000000000003", sort_order: 3, kicker: { en: en.impact.kicker3, fr: fr.impact.kicker3 }, number: en.impact.number3, suffix: en.impact.suffix3 || "", label: { en: en.impact.label3, fr: fr.impact.label3 } },
    { id: "20000000-0000-0000-0000-000000000004", sort_order: 4, kicker: { en: en.impact.kicker4, fr: fr.impact.kicker4 }, number: en.impact.number4, suffix: en.impact.suffix4 || "", label: { en: en.impact.label4, fr: fr.impact.label4 } },
  ]);

  // ─── Stories ────────────────────────────────────────────
  // 1) Remove the legacy fictional stories (invented people and
  //    events from the July 2026 placeholder seed).
  const legacyStoryIds = [
    "30000000-0000-0000-0000-000000000001",
    "30000000-0000-0000-0000-000000000002",
    "30000000-0000-0000-0000-000000000003",
    "30000000-0000-0000-0000-000000000004",
    "30000000-0000-0000-0000-000000000005",
    "30000000-0000-0000-0000-000000000010",
    "30000000-0000-0000-0000-000000000011",
    "30000000-0000-0000-0000-000000000012",
    "30000000-0000-0000-0000-000000000013",
    "30000000-0000-0000-0000-000000000014",
    "30000000-0000-0000-0000-000000000015",
    "30000000-0000-0000-0000-000000000016",
    "30000000-0000-0000-0000-000000000020",
    "30000000-0000-0000-0000-000000000021",
    "30000000-0000-0000-0000-000000000022",
  ];
  await removeRows("stories", legacyStoryIds);

  // 2) Insert honest founding articles drawn from Vision ICC.docx.
  //    Bodies are composed from the vision document's own words and data.
  const foundingStories = [
    {
      id: "31000000-0000-0000-0000-000000000001",
      slug: "why-we-are-building-iwacu",
      title: { en: en.storiesPage.featuredTitle, fr: fr.storiesPage.featuredTitle },
      excerpt: { en: en.storiesPage.featuredExcerpt, fr: fr.storiesPage.featuredExcerpt },
      body: {
        en: `For more than twenty years, I worked within an NGO on programs fighting gender inequality and social injustice. Day after day, in the field, I listened to women and girls. I heard the misery they live in — the violence of every kind they suffer, and the inhuman, degrading treatment they endure.

From that listening came a dream: to create a center of welcome and care for survivors of gender-based violence (GBV) and for the most vulnerable children. We call it Iwacu Collective Center — ICC.

The idea is to put the experience acquired over a professional career at the service of survivors, and to join forces with other actors by building strategic alliances — contributing to the priorities of our government set out in the National Development Plan (PND) and the national vision 2040–2060.

Iwacu means "our home" in Kirundi. That name is the promise at the heart of the center: a survivor who crosses our door is not a case file. She is a person whose dignity must be restored, whose trauma can be transformed into strength, and whose future can be rebuilt.

Our vision is a sanctuary of resilience where every survivor transforms trauma into the strength of autonomy — to take back full control of her life. "Restore hope, rebuild lives, transform the future."

This founding appeal is an invitation: help us build the center. Every gift builds a safer future.`,
        fr: `Depuis plus de vingt ans, je travaille au sein d'une ONG dans les programmes de lutte contre les inégalités de genre et l'injustice sociale. Jour après jour, sur le terrain, j'ai écouté des femmes et des filles. J'ai entendu le malheur dans lequel elles vivent — les violences de toutes sortes dont elles sont victimes, et le traitement inhumain et dégradant qu'elles subissent.

De cette écoute est né un rêve : créer un centre d'accueil et de prise en charge des survivant(e)s des violences basées sur le genre (VBG) et des enfants les plus vulnérables. Nous l'appelons Iwacu Collective Center — ICC en sigle.

L'idée est de mettre l'expérience acquise au cours d'une carrière professionnelle au service des survivant(e)s, et de joindre nos efforts à ceux des autres acteurs en nouant des alliances stratégiques — pour contribuer à la réalisation des priorités du gouvernement figurant dans le PND et la vision nationale 2040–2060.

Iwacu signifie « notre foyer » en kirundi. Ce nom est la promesse au cœur du centre : une survivante qui franchit notre porte n'est pas un dossier. C'est une personne dont il faut restaurer la dignité, dont le traumatisme peut se transformer en force, et dont l'avenir peut se rebâtir.

Notre vision : devenir un sanctuaire de résilience où chaque survivant(e) transforme son traumatisme en une force d'autonomie pour reprendre le plein contrôle de sa vie. « Restaurer l'espoir, rebâtir des vies, transformer l'avenir. »

Cet appel fondateur est une invitation : aidez-nous à bâtir le centre. Chaque don bâtit un avenir plus sûr.`,
      },
      image_placeholder: { en: en.storiesPage.featuredImg, fr: fr.storiesPage.featuredImg },
      tag: { en: "Voices", fr: "Voix" },
      tag_variant: "voices",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 6,
      is_featured: true,
      status: "published",
      published_at: "2026-08-07T00:00:00Z",
    },
    {
      id: "31000000-0000-0000-0000-000000000002",
      slug: "gbv-burundi-the-numbers",
      title: { en: en.storiesPage.recent1Title, fr: fr.storiesPage.recent1Title },
      excerpt: { en: en.storiesPage.recent1Excerpt, fr: fr.storiesPage.recent1Excerpt },
      body: {
        en: `Gender-based violence violates human rights on a massive scale, in Burundi and worldwide. These are the numbers behind our founding — every figure is sourced.

WORLDWIDE — WHO (2025)
About one woman in three — roughly 840 million women aged 15 and over — has experienced physical or sexual violence in her lifetime, from an intimate partner or another person. In 2025, about 316 million women (11%) suffered physical or sexual violence from a partner, and 12.5 million girls aged 15 to 19 reported such violence.

Femicide is the most extreme form. In 2023, nearly 85,000 women and girls were intentionally killed worldwide; 51,000 of them by an intimate partner or a family member — about 140 women every day (UNODC & UN Women, 2026). Africa ranks first for femicide committed within the family: 21,700 victims in 2023.

Progress is desperately slow: in twenty years, intimate-partner violence has fallen by only 0.2% (WHO, 2025). Violence by non-partners remains largely under-reported — some 263 million women since the age of 15.

WHY IT PERSISTS
Discriminatory norms, impunity, limited access to justice and economic inequality. About 70% of countries still have legal frameworks that discriminate against women's access to justice; 54% have no consent-based definition of rape (UN Women, 2026). Armed conflicts make it worse: 676 million women and girls lived near conflict zones in 2024, and reports of conflict-related sexual violence rose by 87% (UN Women, 2025).

And the resources do not follow the scale of the problem: globally, only 0.2% of public development aid funds violence-prevention programs.

IN BURUNDI
22.1% of women aged 15–49 experienced physical or sexual violence from a partner in 2018; a 2017 government survey put lifetime physical violence at 36% (WHO). Economic marginalization compounds the danger: 89.8% of women were in vulnerable employment in 2023, against 76.9% of men (World Bank). According to the MFFPS, more than 200 cases of violence were reported in 2025 — 70% of them GBV against women and children. In January 2026 alone: 26 grave human-rights violations, including 17 cases of sexual violence against minors, two femicides and four infanticides.

Behind every number is a woman who deserved safety. The true figures are higher — stigma and family pressure keep most survivors silent. That silence is why Iwacu must exist.`,
        fr: `Les violences basées sur le genre violent massivement les droits humains, au Burundi comme dans le monde. Voici les chiffres qui fondent notre action — chaque donnée est sourcée.

DANS LE MONDE — OMS (2025)
Environ une femme sur trois — soit près de 840 millions de femmes de 15 ans et plus — a subi des violences physiques ou sexuelles au cours de sa vie, de la part d'un partenaire intime ou d'une autre personne. En 2025, environ 316 millions de femmes (11 %) ont subi des violences physiques ou sexuelles de la part de leur partenaire, et 12,5 millions de filles de 15 à 19 ans ont déclaré de telles violences.

Le féminicide en est la forme la plus extrême : en 2023, près de 85 000 femmes et filles ont été tuées intentionnellement dans le monde, dont 51 000 par leur partenaire intime ou un membre de leur famille — environ 140 femmes par jour (UNODC & ONU-Femmes, 2026). L'Afrique occupe la première place des féminicides commis dans la sphère familiale : 21 700 victimes en 2023.

Les progrès sont très lents : en vingt ans, la violence conjugale n'a diminué que de 0,2 % (OMS, 2025). Les violences sexuelles commises par une personne autre que le partenaire restent largement sous-déclarées : environ 263 millions de femmes en ont été victimes depuis l'âge de 15 ans.

POURQUOI CELA PERSISTE
Normes discriminatoires, impunité des auteurs, accès limité à la justice et inégalités économiques. Environ 70 % des pays disposent encore de cadres juridiques discriminatoires, et 54 % n'ont pas de définition du viol fondée sur le consentement (ONU-Femmes, 2026). Les conflits armés exacerbent ces vulnérabilités : en 2024, 676 millions de femmes et de filles vivaient à proximité de zones de conflit, et les signalements de violences sexuelles liées aux conflits ont augmenté de 87 % (ONU-Femmes, 2025).

Quant aux ressources, elles ne sont pas à la hauteur du problème : 0,2 % seulement de l'aide publique au développement mondiale finance des programmes de prévention des violences faites aux femmes.

AU BURUNDI
22,1 % des femmes de 15 à 49 ans ont subi des violences physiques ou sexuelles de la part de leur partenaire en 2018 ; une enquête gouvernementale de 2017 estimait à 36 % les violences physiques au cours de la vie (OMS). La marginalisation économique aggrave le danger : 89,8 % des femmes étaient dans un emploi vulnérable en 2023, contre 76,9 % des hommes (Banque mondiale). Selon le MFFPS, plus de 200 cas de violences ont été rapportés en 2025 — 70 % concernant des VBG perpétrées à l'égard des femmes et des enfants. Rien qu'en janvier 2026 : 26 cas de violations graves des droits humains, dont 17 violences sexuelles contre des mineures, deux féminicides et quatre infanticides.

Derrière chaque chiffre, il y a une femme qui méritait la sécurité. Les vrais chiffres sont plus élevés encore — la stigmatisation et la pression familiale maintiennent la plupart des survivantes dans le silence. C'est ce silence qui fait qu'Iwacu doit exister.`,
      },
      image_placeholder: { en: en.storiesPage.recent1Img, fr: fr.storiesPage.recent1Img },
      tag: { en: "Field", fr: "Terrain" },
      tag_variant: "field",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 5,
      status: "published",
      published_at: "2026-08-06T00:00:00Z",
    },
    {
      id: "31000000-0000-0000-0000-000000000003",
      slug: "what-iwacu-means",
      title: { en: en.storiesPage.recent2Title, fr: fr.storiesPage.recent2Title },
      excerpt: { en: en.storiesPage.recent2Excerpt, fr: fr.storiesPage.recent2Excerpt },
      body: {
        en: `In Kirundi, the language of Burundi, "iwacu" means our home. It is not a brand and it is not a metaphor chosen by a committee — it is a claim.

A center for survivors of gender-based violence only works if it is, in the deepest sense, a home. A survivor arrives carrying trauma, often rejected or stigmatized by those around her. If the center feels like an institution, she will hide what she carries. If it feels like home — a place without judgment, where her dignity is protected absolutely — healing can begin.

That is why our founding vision is a sanctuary of resilience: a place where each survivor transforms trauma into the strength of autonomy and takes back full control of her life. And it is why our mission goes beyond emergency care: to accompany survivors and vulnerable children toward lasting socio-economic independence — through productive projects, agro-pastoral and entrepreneurial training, income-generating activities and cash transfers — while acting on the roots of injustice by promoting positive masculinities and changing behaviors.

The name is also a promise about who the center belongs to. Iwacu — our home — is built with the community, for the community: with host families, partners, government services and men and boys engaged as allies.

Restore hope. Rebuild lives. Transform the future. For us, these are not slogans. They are the meaning of the word on the door.`,
        fr: `En kirundi, la langue du Burundi, « iwacu » signifie notre foyer. Ce n'est ni une marque ni une métaphore choisie par un comité — c'est une affirmation.

Un centre pour survivant(e)s de violences basées sur le genre ne fonctionne que s'il est, au sens le plus profond, un foyer. Une survivante arrive portant un traumatisme, souvent rejetée ou stigmatisée par son entourage. Si le centre ressemble à une institution, elle cachera ce qu'elle porte. S'il ressemble à un foyer — un lieu sans jugement, où sa dignité est protégée de manière absolue — la guérison peut commencer.

C'est pourquoi notre vision fondatrice est un sanctuaire de résilience : un lieu où chaque survivant(e) transforme son traumatisme en une force d'autonomie et reprend le plein contrôle de sa vie. Et c'est pourquoi notre mission dépasse les soins d'urgence : accompagner les survivant(e)s et les enfants vulnérables vers une indépendance socio-économique durable — par des projets productifs, des formations agropastorales et entrepreneuriales, des activités génératrices de revenus et des transferts monétaires — tout en agissant sur les racines de l'injustice par la promotion des masculinités positives et le changement des comportements.

Le nom est aussi une promesse sur l'appartenance du centre. Iwacu — notre foyer — se construit avec la communauté, pour la communauté : avec les familles d'accueil, les partenaires, les services du gouvernement et les hommes et garçons engagés comme alliés.

Restaurer l'espoir. Rebâtir des vies. Transformer l'avenir. Pour nous, ce ne sont pas des slogans. C'est le sens du mot écrit sur la porte.`,
      },
      image_placeholder: { en: en.storiesPage.recent2Img, fr: fr.storiesPage.recent2Img },
      tag: { en: "Voices", fr: "Voix" },
      tag_variant: "voices",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 4,
      status: "published",
      published_at: "2026-08-05T00:00:00Z",
    },
    {
      id: "31000000-0000-0000-0000-000000000004",
      slug: "nine-pillars-one-center",
      title: { en: en.storiesPage.recent3Title, fr: fr.storiesPage.recent3Title },
      excerpt: { en: en.storiesPage.recent3Excerpt, fr: fr.storiesPage.recent3Excerpt },
      body: {
        en: `An integrated center is not a collection of services under one roof. It is one approach — holistic, centered on the survivor — expressed through nine pillars that reinforce one another.

PILLAR 1 — Psychosocial care. First welcome by a social worker, then psychological support to treat trauma, for survivors of GBV and for orphans and other vulnerable children.

PILLAR 2 — Medical care. A referral system connecting survivors to care, and capacity-building for the health personnel who receive them.

PILLAR 3 — Legal and judicial assistance. Guidance for filing complaints, legal aid, and accompaniment through the procedures. This pillar also includes strengthening the reception capacities of care structures and creating a secure computerized case-management system.

PILLAR 4 — Socio-economic reintegration of survivors. Agro-pastoral and entrepreneurial activities that both sustain the daily life of residents and build their skills: entrepreneurship training, income-generating activities (AGR) and cash transfers for financial independence.

PILLAR 5 — Reintegration of vulnerable children into their families or host families, including paternity tracing.

PILLAR 6 — A referral system for vulnerable children, alongside family tracing and placement.

PILLAR 7 — Childcare services, so that mothers in the program can fully participate in training and work.

PILLAR 8 — Engaging men in the fight against GBV: positive masculinity, and the "men champions" who model change.

PILLAR 9 — Research, to measure what works and keep improving the model.

Nine pillars, one conviction: a survivor cannot be healed in one room while the rest of her life collapses in another. The center treats the whole person — and, with her, the community around her.`,
        fr: `Un centre intégré n'est pas une collection de services sous un même toit. C'est une seule approche — holistique, centrée sur la survivante — déclinée en neuf piliers qui se renforcent mutuellement.

PILIER 1 — Prise en charge psychosociale. Premier accueil par une assistante sociale, puis suivi psychologique pour traiter les traumatismes, pour les survivantes de VBG et pour les orphelins et autres enfants vulnérables.

PILIER 2 — Prise en charge médicale. Un système de référencement des survivantes vers les soins, et le renforcement des capacités du personnel soignant qui les reçoit.

PILIER 3 — Assistance juridique et judiciaire. Orientation pour le dépôt de plainte, aide juridictionnelle et accompagnement dans les procédures. Ce pilier inclut aussi le renforcement des capacités d'accueil des structures de prise en charge et la création d'un système informatisé sécurisé des dossiers.

PILIER 4 — Réinsertion socio-économique des survivantes. Des activités agropastorales et entrepreneuriales qui contribuent à la fois à la prise en charge quotidienne des personnes logées au centre et au renforcement de leurs capacités : formations en entrepreneuriat, activités génératrices de revenus (AGR) et transferts monétaires pour favoriser l'indépendance financière.

PILIER 5 — Réinsertion des OEV dans leurs familles ou familles d'accueil, y compris la recherche de paternité.

PILIER 6 — Un système de référencement pour les OEV, avec recherche de la famille et placement.

PILIER 7 — Des services de gardiennage des enfants, pour que les mères du programme puissent participer pleinement aux formations et au travail.

PILIER 8 — L'engagement des hommes dans la lutte contre les VBG : masculinité positive, et des « hommes champions » qui incarnent le changement.

PILIER 9 — La recherche, pour mesurer ce qui fonctionne et améliorer sans cesse le modèle.

Neuf piliers, une conviction : on ne guérit pas une survivante dans une pièce pendant que le reste de sa vie s'effondre dans une autre. Le centre soigne la personne entière — et, avec elle, la communauté qui l'entoure.`,
      },
      image_placeholder: { en: en.storiesPage.recent3Img, fr: fr.storiesPage.recent3Img },
      tag: { en: "Ongoing", fr: "En cours" },
      tag_variant: "ongoing",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 6,
      status: "published",
      published_at: "2026-08-04T00:00:00Z",
    },
    {
      id: "31000000-0000-0000-0000-000000000005",
      slug: "positive-masculinity",
      title: { en: en.storiesPage.recent4Title, fr: fr.storiesPage.recent4Title },
      excerpt: { en: en.storiesPage.recent4Excerpt, fr: fr.storiesPage.recent4Excerpt },
      body: {
        en: `In Burundi, as elsewhere, the persistence of gender-based violence has deep roots. One of the most powerful is social and cultural norms — ideas so embedded that they legitimize violence within couples, trivialize it, and make it acceptable.

A center that only treats survivors will be needed forever. So the eighth pillar of Iwacu Collective Center is prevention: engaging men and boys as allies, and promoting positive masculinity.

THE MEN CHAMPIONS. Within communities, some men are ready to stand up publicly against violence and to model different behavior. Our approach identifies, trains and supports these men champions — because a message carried by other men reaches further than one carried only by institutions. They become references in their neighborhoods: for other men, and for boys deciding what kind of man to become.

WHAT CHANGES LOOK LIKE. A man who shares decisions and household resources reduces the economic dependence that traps so many women in violent relationships. A father who values his daughter's education changes her future. A boy who grows up seeing violence condemned does not become an adult who practices it.

This is also a question of alliances: no single organization transforms norms alone. We work with communities, host families, partners and government services to build a protective net around the most vulnerable — and men and boys are part of that net, not outside it.

Care heals the wounds of today. Changing norms prevents the wounds of tomorrow. Iwacu is committed to both.`,
        fr: `Au Burundi comme ailleurs, la persistance des violences basées sur le genre a des racines profondes. L'une des plus puissantes est les normes sociales et culturelles — des idées tellement enracinées qu'elles légitiment certaines violences au sein des couples, contribuant à les banaliser et à les faire accepter.

Un centre qui soigne seulement les survivant(e)s sera nécessaire éternellement. C'est pourquoi le huitième pilier du Centre Collectif Iwacu est la prévention : engager les hommes et les garçons comme alliés, et promouvoir la masculinité positive.

LES HOMMES CHAMPIONS. Au sein des communautés, certains hommes sont prêts à s'opposer publiquement aux violences et à incarner un comportement différent. Notre approche identifie, forme et accompagne ces hommes champions — car un message porté par d'autres hommes va plus loin qu'un message porté seulement par des institutions. Ils deviennent des références dans leurs quartiers : pour les autres hommes, et pour les garçons qui décident de quel homme devenir.

À QUOI RESSEMBLE LE CHANGEMENT. Un homme qui partage les décisions et les ressources du foyer réduit la dépendance économique qui enferme tant de femmes dans des relations violentes. Un père qui valorise l'éducation de sa fille transforme son avenir. Un garçon qui grandit en voyant la violence condamnée ne devient pas un adulte qui la pratique.

C'est aussi une question d'alliances : aucune organisation ne transforme les normes seule. Nous travaillons avec les communautés, les familles d'accueil, les partenaires et les services du gouvernement pour créer un filet de sécurité autour des plus vulnérables — et les hommes et les garçons font partie de ce filet, pas de l'extérieur.

La prise en charge soigne les blessures d'aujourd'hui. Changer les normes empêche les blessures de demain. Iwacu s'engage dans les deux.`,
      },
      image_placeholder: { en: en.storiesPage.recent4Img, fr: fr.storiesPage.recent4Img },
      tag: { en: "Ongoing", fr: "En cours" },
      tag_variant: "ongoing",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 5,
      status: "published",
      published_at: "2026-08-03T00:00:00Z",
    },
    {
      id: "31000000-0000-0000-0000-000000000006",
      slug: "from-vision-to-ground",
      title: { en: en.storiesPage.recent5Title, fr: fr.storiesPage.recent5Title },
      excerpt: { en: en.storiesPage.recent5Excerpt, fr: fr.storiesPage.recent5Excerpt },
      body: {
        en: `The vision document is written. The conviction is twenty years deep. What remains is the work of building — and it is underway.

LEGAL FOUNDATION. Iwacu Collective Center is being formally established in Burundi, with legal registration as a first milestone. Transparency about this stage matters: we are an organization in formation, and we will publish our progress as it happens.

ALLIANCES. From the start, the model is built on partnership — with other actors in the fight against gender-based violence, with government services whose priorities we support (the National Development Plan and the vision 2040–2060), and with communities themselves.

THE SITE AND THE TEAM. The center needs a physical home: buildings for welcome, psychosocial care, training and childcare, and space for the agro-pastoral activities that sustain residents and build skills. Around that site, a team is taking shape — the social workers, psychologists, legal accompaniers and trainers who will bring the nine pillars to life. They will be introduced on this site as they join.

WHAT WE NEED. Land and buildings. Training materials and start-up kits for income-generating activities. The secure case-management system promised in our legal pillar. And time — but time is the one thing survivors don't have. Every gift accelerates the opening of these doors.

We will report our progress here, honestly, including the setbacks. That is what "our home" demands of us.`,
        fr: `Le document de vision est écrit. La conviction a vingt ans de profondeur. Reste l'œuvre à bâtir — et elle est en cours.

FONDATIONS JURIDIQUES. Le Centre Collectif Iwacu est en cours de création au Burundi, avec l'enregistrement légal comme première étape. La transparence sur cette phase compte : nous sommes une organisation en création, et nous publierons nos progrès au fur et à mesure.

LES ALLIANCES. Dès le départ, le modèle est construit sur le partenariat — avec les autres acteurs de la lutte contre les violences basées sur le genre, avec les services du gouvernement dont nous soutenons les priorités (le PND et la vision 2040–2060), et avec les communautés elles-mêmes.

LE SITE ET L'ÉQUIPE. Le centre a besoin d'un foyer physique : des bâtiments pour l'accueil, la prise en charge psychosociale, les formations et le gardiennage des enfants, ainsi que de l'espace pour les activités agropastorales qui soutiennent les résidentes et développent leurs compétences. Autour de ce site, une équipe se constitue — assistantes sociales, psychologues, accompagnatrices juridiques et formatrices qui donneront vie aux neuf piliers. Elles seront présentées sur ce site au fur et à mesure de leur arrivée.

CE DONT NOUS AVONS BESOIN. Un terrain et des bâtiments. Du matériel de formation et des kits de démarrage pour les activités génératrices de revenus. Le système informatisé sécurisé des dossiers promis dans notre pilier juridique. Et du temps — mais le temps est justement ce que les survivantes n'ont pas. Chaque don accélère l'ouverture de ces portes.

Nous rendrons compte de nos progrès ici, honnêtement, y compris des difficultés. C'est ce que « notre foyer » nous demande.`,
      },
      image_placeholder: { en: en.storiesPage.recent5Img, fr: fr.storiesPage.recent5Img },
      tag: { en: "Field", fr: "Terrain" },
      tag_variant: "field",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 4,
      status: "published",
      published_at: "2026-08-02T00:00:00Z",
    },
    {
      id: "31000000-0000-0000-0000-000000000007",
      slug: "twenty-years-of-listening",
      title: { en: en.storiesPage.recent6Title, fr: fr.storiesPage.recent6Title },
      excerpt: { en: en.storiesPage.recent6Excerpt, fr: fr.storiesPage.recent6Excerpt },
      body: {
        en: `Iwacu Collective Center did not start with a business plan. It started with twenty years of listening.

For more than two decades, its founder worked within an NGO on programs fighting gender inequality and social injustice — working in the field alongside women and girls, hearing daily about the violence they suffer and the degrading treatment they endure.

That career taught lessons no classroom can:

LISTENING IS A PROFESSIONAL SKILL. Survivors reveal what they carry only when the welcome is without judgment. The quality of the first reception — by a social worker trained in active listening — determines everything that follows in the care pathway.

VIOLENCE IS SYSTEMIC, NOT INCIDENTAL. Behind each case stand the same structures: discriminatory norms, impunity, slow justice, economic dependence. Treating one wound at a time, without touching those structures, is not enough. This is why the center pairs care with prevention and with economic independence.

ALLIANCES MULTIPLY IMPACT. No actor — however experienced — transforms a national problem alone. The strategic alliances at the heart of ICC's model exist because twenty years of partnership taught us what works: shared referral systems, reinforced government services, and communities that own the solution.

The center's model — nine pillars, five values, one integrated approach — is the distillation of this experience. What is new is the scale of the ambition: to gather everything survivors need, in one place, under one roof. A home.

That is the experience your support builds on.`,
        fr: `Le Centre Collectif Iwacu n'est pas né d'un plan d'affaires. Il est né de vingt ans d'écoute.

Pendant plus de deux décennies, sa fondatrice a travaillé au sein d'une ONG dans les programmes de lutte contre les inégalités de genre et l'injustice sociale — sur le terrain, aux côtés des femmes et des filles, entendant au quotidien les violences dont elles sont victimes et le traitement dégradant qu'elles subissent.

Ce parcours a enseigné des leçons qu'aucune salle de classe ne peut donner :

L'ÉCOUTE EST UN SAVOIR-FAIRE PROFESSIONNEL. Les survivantes ne révèlent ce qu'elles portent que lorsque l'accueil se fait sans jugement. La qualité de la première réception — par une assistante sociale formée à l'écoute active — détermine tout ce qui suit dans le parcours de prise en charge.

LA VIOLENCE EST SYSTÉMIQUE, PAS ACCIDENTELLE. Derrière chaque cas se dressent les mêmes structures : normes discriminatoires, impunité, lenteur de la justice, dépendance économique. Soigner une blessure à la fois, sans toucher ces structures, ne suffit pas. C'est pourquoi le centre associe la prise en charge à la prévention et à l'indépendance économique.

LES ALLIANCES MULTIPLIENT L'IMPACT. Aucun acteur — si expérimenté soit-il — ne transforme seul un problème national. Les alliances stratégiques au cœur du modèle d'ICC existent parce que vingt ans de partenariat ont montré ce qui fonctionne : des systèmes de référencement partagés, des services publics renforcés, et des communautés qui s'approprient la solution.

Le modèle du centre — neuf piliers, cinq valeurs, une approche intégrée — est la distillation de cette expérience. Ce qui est nouveau, c'est l'ambition : réunir tout ce dont les survivantes ont besoin, en un seul lieu, sous un seul toit. Un foyer.

C'est sur cette expérience que votre soutien s'appuie.`,
      },
      image_placeholder: { en: en.storiesPage.recent6Img, fr: fr.storiesPage.recent6Img },
      tag: { en: "Voices", fr: "Voix" },
      tag_variant: "voices",
      location: "Burundi",
      author_name: "Iwacu Collective Center",
      author_initials: "ICC",
      read_time: 5,
      status: "published",
      published_at: "2026-08-01T00:00:00Z",
    },
  ];

  await upsert("stories", foundingStories);

  // ─── Team Members ───────────────────────────────────────
  // INTENTIONALLY SKIPPED. The team is managed exclusively via
  // the admin panel → Supabase (real names and photos). The
  // fictional members from the original seed were removed.
  console.log("  – team_members: skipped (managed via admin panel)");

  // ─── Timeline Events ────────────────────────────────────
  // The 2018–2026 milestones were placeholder fiction. The
  // section is hidden on the About page; clear the rows so no
  // invented history remains in the database.
  await removeRows("timeline_events", [
    "50000000-0000-0000-0000-000000000001",
    "50000000-0000-0000-0000-000000000002",
    "50000000-0000-0000-0000-000000000003",
    "50000000-0000-0000-0000-000000000004",
    "50000000-0000-0000-0000-000000000005",
    "50000000-0000-0000-0000-000000000006",
  ]);

  // ─── Values — the five real values from the vision doc ──
  await removeRows("org_values", ["60000000-0000-0000-0000-000000000006"]);
  await upsert("org_values", [
    { id: "60000000-0000-0000-0000-000000000001", number: "01", title: { en: en.about.val1Title, fr: fr.about.val1Title }, description: { en: en.about.val1Text, fr: fr.about.val1Text } },
    { id: "60000000-0000-0000-0000-000000000002", number: "02", title: { en: en.about.val2Title, fr: fr.about.val2Title }, description: { en: en.about.val2Text, fr: fr.about.val2Text } },
    { id: "60000000-0000-0000-0000-000000000003", number: "03", title: { en: en.about.val3Title, fr: fr.about.val3Title }, description: { en: en.about.val3Text, fr: fr.about.val3Text } },
    { id: "60000000-0000-0000-0000-000000000004", number: "04", title: { en: en.about.val4Title, fr: fr.about.val4Title }, description: { en: en.about.val4Text, fr: fr.about.val4Text } },
    { id: "60000000-0000-0000-0000-000000000005", number: "05", title: { en: en.about.val5Title, fr: fr.about.val5Title }, description: { en: en.about.val5Text, fr: fr.about.val5Text } },
  ]);

  // ─── About Page Content ─────────────────────────────────
  await upsert("about_content", [
    {
      id: "70000000-0000-0000-0000-000000000001",
      hero: {
        en: {
          eyebrow: en.about.heroEyebrow,
          heading: en.about.heroHeading,
          headingItalic: en.about.heroHeadingItalic,
          description: en.about.heroDescription,
          facts: [
            { key: en.about.factKey1, value: en.about.factVal1 },
            { key: en.about.factKey2, value: en.about.factVal2 },
            { key: en.about.factKey3, value: en.about.factVal3 },
            { key: en.about.factKey4, value: en.about.factVal4 },
          ],
        },
        fr: {
          eyebrow: fr.about.heroEyebrow,
          heading: fr.about.heroHeading,
          headingItalic: fr.about.heroHeadingItalic,
          description: fr.about.heroDescription,
          facts: [
            { key: fr.about.factKey1, value: fr.about.factVal1 },
            { key: fr.about.factKey2, value: fr.about.factVal2 },
            { key: fr.about.factKey3, value: fr.about.factVal3 },
            { key: fr.about.factKey4, value: fr.about.factVal4 },
          ],
        },
      },
      our_story: {
        en: {
          sidebarEyebrow: en.about.storyEyebrow,
          sidebarHeading: en.about.storySidebarHeading,
          paragraphs: [en.about.storyP1, en.about.storyP2],
          beliefHeading: en.about.beliefHeading,
          beliefParagraphs: [en.about.beliefP1, en.about.beliefP2],
          blockquote: en.about.blockquote,
          blockquoteCite: en.about.blockquoteCite,
          notDoHeading: en.about.notDoHeading,
          notDoParagraphs: [en.about.notDoP1, en.about.notDoP2],
          valuesHeading: en.about.valuesHeading,
          valuesDescription: en.about.valuesDescription,
          teamEyebrow: en.about.teamEyebrow,
          teamHeading: en.about.teamHeading,
          teamDescription: en.about.teamDescription,
          timelineEyebrow: en.about.timelineEyebrow,
          timelineHeading: en.about.timelineHeading,
          portraitPlaceholder: en.about.portraitPlaceholder,
          portraitCaptionLeft: en.about.portraitCaptionLeft,
          portraitCaptionRight: en.about.portraitCaptionRight,
        },
        fr: {
          sidebarEyebrow: fr.about.storyEyebrow,
          sidebarHeading: fr.about.storySidebarHeading,
          paragraphs: [fr.about.storyP1, fr.about.storyP2],
          beliefHeading: fr.about.beliefHeading,
          beliefParagraphs: [fr.about.beliefP1, fr.about.beliefP2],
          blockquote: fr.about.blockquote,
          blockquoteCite: fr.about.blockquoteCite,
          notDoHeading: fr.about.notDoHeading,
          notDoParagraphs: [fr.about.notDoP1, fr.about.notDoP2],
          valuesHeading: fr.about.valuesHeading,
          valuesDescription: fr.about.valuesDescription,
          teamEyebrow: fr.about.teamEyebrow,
          teamHeading: fr.about.teamHeading,
          teamDescription: fr.about.teamDescription,
          timelineEyebrow: fr.about.timelineEyebrow,
          timelineHeading: fr.about.timelineHeading,
          portraitPlaceholder: fr.about.portraitPlaceholder,
          portraitCaptionLeft: fr.about.portraitCaptionLeft,
          portraitCaptionRight: fr.about.portraitCaptionRight,
        },
      },
      contact_cta: {
        en: {
          heading: en.about.contactHeading,
          headingItalic: en.about.contactHeadingItalic,
          description: en.about.contactDescription,
          supportWork: en.about.supportWork,
        },
        fr: {
          heading: fr.about.contactHeading,
          headingItalic: fr.about.contactHeadingItalic,
          description: fr.about.contactDescription,
          supportWork: fr.about.supportWork,
        },
      },
    },
  ]);

  console.log("\n✅ Seeding complete!");
}

seed().catch(console.error);
