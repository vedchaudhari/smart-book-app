import HeroAuthButtons from "@/components/HeroAuthButtons";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8 text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
        Organize your bookmarks <br className="hidden md:block" />
        <span className="text-indigo-600 dark:text-indigo-400">Intelligently.</span>
      </h1>
      <p className="max-w-2xl text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
        The smartest way to save, organize, and access your favorite links from anywhere.
        Secure, fast, and always in sync.
      </p>
      <HeroAuthButtons />
    </div>
  );
}
