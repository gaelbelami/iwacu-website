import { getSupabase } from "@/lib/supabase";

type Locale = "en" | "fr";

export interface DonateSettings {
  goal: number;
  raised: number;
  currency: string;
  stripeUrl: string;
  mobileText: { en: string; fr: string };
  bankText: { en: string; fr: string };
  email: string;
}

export async function getDonateSettings(locale: Locale): Promise<DonateSettings> {
  const defaults: DonateSettings = {
    goal: 0,
    raised: 0,
    currency: "USD",
    stripeUrl: "",
    mobileText: { en: "", fr: "" },
    bankText: { en: "", fr: "" },
    email: "",
  };

  const supabase = getSupabase();
  if (!supabase) return defaults;

  const { data } = await supabase
    .from("site_settings")
    .select("email, content")
    .limit(1)
    .single();

  if (!data) return defaults;

  const donate = (data.content as Record<string, any>)?.donate || {};

  return {
    goal: Number(donate.goal) || 0,
    raised: Number(donate.raised) || 0,
    currency: donate.currency || "USD",
    stripeUrl: donate.stripeUrl || "",
    mobileText: {
      en: donate.mobileText?.en || "",
      fr: donate.mobileText?.fr || "",
    },
    bankText: {
      en: donate.bankText?.en || "",
      fr: donate.bankText?.fr || "",
    },
    email: data.email || "",
  };
}
