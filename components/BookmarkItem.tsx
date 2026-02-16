import { Bookmark } from "@/types/bookmark";
import { Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";

interface BookmarkItemProps {
    bookmark: Bookmark;
    onDelete: (id: string) => Promise<void>;
}

export default function BookmarkItem({ bookmark, onDelete }: BookmarkItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await onDelete(bookmark.id);
        } catch (error) {
            console.error("Failed to delete", error);
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 mb-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow dark:bg-zinc-800 dark:border-zinc-700">
            <div className="flex-1 min-w-0 pr-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 truncate">
                    {bookmark.title}
                </h3>
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline truncate flex items-center gap-1"
                >
                    {bookmark.url}
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700 ${isDeleting ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-gray-400 hover:text-red-500'}`}
                title="Delete bookmark"
            >
                {isDeleting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Trash2 className="w-5 h-5" />
                )}
            </button>
        </div>
    );
}
