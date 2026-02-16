"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabaseClient";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";

import { BookmarkProvider } from "@/context/BookmarkContext";

export default function DashboardPage() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
            } else {
                setLoading(false);
            }
        };
        checkUser();
    }, [router, supabase]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <BookmarkProvider>
            <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your bookmarks efficiently.</p>
                </div>

                <BookmarkForm />

                <div className="mt-10">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Your Bookmarks</h2>
                    <BookmarkList />
                </div>
            </div>
        </BookmarkProvider>
    );
}
