import { loginAction, signupAction, loginWithGoogleAction } from "@/actions/auth";
import { getAdminUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const user = await getAdminUser();
  if (user) redirect("/admin");

  const params = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F2E4]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-[#2E3D2E]/10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#2E3D2E] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-[#E8C87A] font-bold text-lg font-[family-name:var(--font-space-grotesk)]">
              ICC
            </span>
          </div>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#2E3D2E]">
            Admin Login
          </h1>
          <p className="text-sm text-[#2E3D2E]/60 mt-1">
            Iwacu Collective Center
          </p>
        </div>

        {params.error && (
          <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {params.error}
          </div>
        )}

        {params.success && (
          <div className="mb-4 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg">
            {params.success}
          </div>
        )}

        {/* Google Login */}
        <form action={loginWithGoogleAction} className="mb-6">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 py-2.5 border border-[#2E3D2E]/20 rounded-lg font-medium text-sm hover:bg-[#F7F2E4] transition-colors text-[#2E3D2E]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>
        </form>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2E3D2E]/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-[#2E3D2E]/40">or</span>
          </div>
        </div>

        {/* Email/Password Login */}
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/30 text-[#1A211A]"
              placeholder="admin@iwacu.org"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#2E3D2E]/80 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[#2E3D2E]/20 bg-[#F7F2E4] focus:outline-none focus:ring-2 focus:ring-[#2E3D2E]/30 text-[#1A211A]"
              placeholder="••••••••"
            />
          </div>

          <button
            formAction={loginAction}
            type="submit"
            className="w-full py-2.5 bg-[#2E3D2E] text-[#EFE9DA] rounded-lg font-semibold hover:bg-[#2E3D2E]/90 transition-colors"
          >
            Sign In
          </button>

          <button
            formAction={signupAction}
            type="submit"
            className="w-full py-2.5 border border-[#2E3D2E]/20 text-[#2E3D2E] rounded-lg font-medium hover:bg-[#2E3D2E]/5 transition-colors text-sm"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
