"use server";

import { getSupabase } from "@/lib/supabase";

export async function subscribeNewsletter(email: string): Promise<{
  success: boolean;
  message: string;
}> {
  // Basic validation
  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address." };
  }

  const supabase = getSupabase();

  if (!supabase) {
    // No Supabase — log to console for now
    console.log(`[Newsletter] New subscriber: ${email}`);
    return {
      success: true,
      message: "Thank you! You'll hear from us soon.",
    };
  }

  const { error } = await supabase.from("newsletter_subscribers").insert({
    email: email.toLowerCase().trim(),
    source: "website",
  });

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "This email is already subscribed.",
      };
    }
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }

  return {
    success: true,
    message: "Thank you! You'll hear from us soon.",
  };
}
