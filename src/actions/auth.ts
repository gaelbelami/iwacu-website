"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?error=" + encodeURIComponent(error.message));
  }

  redirect("/admin");
}

export async function signupAction(formData: FormData): Promise<void> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect("/admin/login?error=" + encodeURIComponent(error.message));
  }

  redirect("/admin/login?success=" + encodeURIComponent("Check your email to confirm your account."));
}

export async function loginWithGoogleAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/admin/auth/callback",
    },
  });

  if (error) {
    redirect("/admin/login?error=" + encodeURIComponent(error.message));
  }

  if (data?.url) {
    redirect(data.url);
  }
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
