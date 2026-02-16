import Link from "next/link";
import AuthButton from "./AuthButton";
import { Bookmark } from "lucide-react";

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-indigo-600 rounded-lg text-white group-hover:bg-indigo-700 transition-colors">
                                <Bookmark className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                                syncmarks
                            </span>
                        </Link>
                    </div>
                    <div>
                        <AuthButton />
                    </div>
                </div>
            </div>
        </nav>
    );
}
