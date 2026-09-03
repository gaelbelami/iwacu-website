import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll can be called from Server Components where cookies
            // can't be set. This is expected and safe when middleware
            // handles the refresh.
          }
        },
      },
    }
  );
}

/** Check if current user is authenticated. Returns user or null. */
export async function getAdminUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  } catch {
    return null;
  }
}

/** Require auth — redirect to login if not authenticated. */
export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}
