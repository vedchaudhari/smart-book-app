import { Bookmark } from "@/types/bookmark";
import { Trash2, ExternalLink } from "lucide-react";

interface BookmarkItemProps {
    bookmark: Bookmark;
    onDelete: (id: string) => void;
}

export default function BookmarkItem({ bookmark, onDelete }: BookmarkItemProps) {
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
                onClick={() => onDelete(bookmark.id)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-zinc-700"
                title="Delete bookmark"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}
