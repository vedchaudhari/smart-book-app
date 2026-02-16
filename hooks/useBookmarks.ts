"use client";

import { useBookmarkContext } from "@/context/BookmarkContext";

export function useBookmarks() {
    return useBookmarkContext();
}
