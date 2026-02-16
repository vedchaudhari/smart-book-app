"use client";

import { createClient } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import type { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export default function HeroAuthButtons() {
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

    if (loading) {
        return (
            <div className="flex gap-4 justify-center">
                <div className="w-32 h-12 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
                <div className="w-32 h-12 bg-gray-200 dark:bg-zinc-800 animate-pulse rounded-lg"></div>
            </div>
        );
    }

    if (user) {
        return (
            <div className="flex gap-4 justify-center">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <LayoutDashboard className="w-5 h-5" />
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="flex gap-4 justify-center">
            <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
            >
                Get Started
                <ArrowRight className="w-5 h-5" />
            </button>
            <button
                onClick={handleLogin}
                className="px-8 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all cursor-pointer"
            >
                Login
            </button>
        </div>
    );
}
