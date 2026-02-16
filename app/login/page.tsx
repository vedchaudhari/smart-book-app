"use client";

import { createClient } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AuthButton from "@/components/AuthButton";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Check if already logged in
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                router.push("/dashboard");
            }
        };
        checkUser();
    }, [router, supabase]);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-zinc-950 px-4">
            <div className="w-full max-w-md space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-800 text-center">
                <div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Sign in to access your bookmarks
                    </p>
                </div>

                <div className="mt-8">
                    <div className="flex justify-center">
                        <AuthButton />
                    </div>
                </div>
            </div>
        </div>
    );
}
