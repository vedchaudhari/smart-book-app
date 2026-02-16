"use client";

import { useState } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Plus, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabaseClient";
import { useEffect } from "react";

export default function BookmarkForm() {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addBookmark } = useBookmarks();
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUserId(user?.id || null);
        };
        getUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !title || !userId) return;

        setIsSubmitting(true);
        try {
            await addBookmark(title, url, userId);
            setUrl("");
            setTitle("");
        } catch (error) {
            console.error("Failed to add bookmark", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!userId) return null;

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8 p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Add New Bookmark</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        URL
                    </label>
                    <input
                        id="url"
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder="My Awesome Bookmark"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" />
                            Add Bookmark
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
