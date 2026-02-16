"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Bookmark } from "@/types/bookmark";

type BookmarkContextType = {
    bookmarks: Bookmark[];
    loading: boolean;
    addBookmark: (title: string, url: string, user_id: string) => Promise<void>;
    deleteBookmark: (id: string) => Promise<void>;
};

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        let channel: ReturnType<typeof supabase.channel> | null = null;

        const setupRealtime = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            fetchBookmarks();

            channel = supabase
                .channel("realtime bookmarks")
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "bookmarks",
                        // Removed filter to allow DELETE events (which don't include user_id)
                        // and to support real-time updates for all users.
                    },
                    (payload: any) => {
                        console.log('Realtime payload:', payload);
                        if (payload.eventType === "INSERT") {
                            setBookmarks((prev) => {
                                const newBookmark = payload.new as Bookmark;
                                if (prev.some(b => b.id === newBookmark.id)) {
                                    return prev;
                                }
                                return [newBookmark, ...prev];
                            });
                        } else if (payload.eventType === "DELETE") {
                            setBookmarks((prev) =>
                                prev.filter((bookmark) => String(bookmark.id) !== String(payload.old.id))
                            );
                        } else if (payload.eventType === "UPDATE") {
                            setBookmarks((prev) =>
                                prev.map((bookmark) =>
                                    bookmark.id === payload.new.id ? (payload.new as Bookmark) : bookmark
                                )
                            );
                        }
                    }
                )
                .subscribe((status: string) => {
                    console.log("Realtime subscription status:", status);
                });
        };

        setupRealtime();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, []);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("bookmarks")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                throw error;
            }

            setBookmarks(data || []);
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
        } finally {
            setLoading(false);
        }
    };

    const addBookmark = async (title: string, url: string, user_id: string) => {
        const { data, error } = await supabase.from("bookmarks").insert([
            { title, url, user_id },
        ])
            .select()
            .single();

        if (error) {
            console.error("Error adding bookmark:", error);
            throw error;
        }

        if (data) {
            setBookmarks((prev) => [data, ...prev]);
        }
    };

    const deleteBookmark = async (id: string) => {
        const { error } = await supabase.from("bookmarks").delete().eq("id", id);

        if (error) {
            console.error("Error deleting bookmark:", error);
            throw error;
        }
    };

    return (
        <BookmarkContext.Provider value={{ bookmarks, loading, addBookmark, deleteBookmark }}>
            {children}
        </BookmarkContext.Provider>
    );
}

export function useBookmarkContext() {
    const context = useContext(BookmarkContext);
    if (context === undefined) {
        throw new Error("useBookmarkContext must be used within a BookmarkProvider");
    }
    return context;
}
