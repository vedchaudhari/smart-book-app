"use client";

import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { LogOut, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function AuthButton() {
    const router = useRouter();
    const supabase = createClient();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        });
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login"); // Redirect to login after logout
        router.refresh();
    };

    if (loading) return <div className="w-24 h-9 bg-gray-200 dark:bg-zinc-700 animate-pulse rounded-lg"></div>;

    return user ? (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg transition-colors border border-gray-200 dark:border-zinc-700"
        >
            <LogOut className="w-4 h-4" />
            Sign Out
        </button>
    ) : (
        <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm hover:shadow-md"
        >
            <LogIn className="w-4 h-4" />
            Sign In
        </button>
    );
}
