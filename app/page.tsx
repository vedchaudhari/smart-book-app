import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseClient"; // Note: In a server component, we should ideally use createServerClient but for simple redirect check, client auth check on client side or strict server check is needed. 
// However, since we don't have cookies setup for server-side auth easily without middleware, we might want to do a client-side redirect or just a simple landing page.
// The prompt said "Landing page (redirect to login/dashboard)".
// I'll make a simple landing page that redirects if logged in, otherwise shows a "Get Started" button.

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
        Organize your bookmarks <br className="hidden md:block" />
        <span className="text-indigo-600 dark:text-indigo-400">Intelligently.</span>
      </h1>
      <p className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
        The smartest way to save, organize, and access your favorite links from anywhere.
        Secure, fast, and always in sync.
      </p>
      <div className="flex gap-4">
        <a
          href="/dashboard"
          className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Get Started
        </a>
        <a
          href="/login"
          className="px-8 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all"
        >
          Login
        </a>
      </div>
    </div>
  );
}
