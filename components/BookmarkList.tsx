"use client";

import { useBookmarks } from "@/hooks/useBookmarks";
import BookmarkItem from "./BookmarkItem";

export default function BookmarkList() {
    const { bookmarks, loading, deleteBookmark } = useBookmarks();

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (bookmarks.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No bookmarks yet. Add one above!</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-6">
            {bookmarks.map((bookmark) => (
                <BookmarkItem
                    key={bookmark.id}
                    bookmark={bookmark}
                    onDelete={deleteBookmark}
                />
            ))}
        </div>
    );
}
