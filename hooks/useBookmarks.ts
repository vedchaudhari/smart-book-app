"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { Bookmark } from "@/types/bookmark";

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchBookmarks();

        // Subscribe to realtime changes
        const channel = supabase
            .channel("realtime bookmarks")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload) => {
                    console.log('Realtime payload:', payload); // Debugging
                    if (payload.eventType === "INSERT") {
                        setBookmarks((prev) => {
                            const newBookmark = payload.new as Bookmark;
                            // Prevent duplicate if we already added it manually
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
            .subscribe((status) => {
                console.log("Realtime subscription status:", status);
            });

        return () => {
            supabase.removeChannel(channel);
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

    return { bookmarks, loading, addBookmark, deleteBookmark };
}
