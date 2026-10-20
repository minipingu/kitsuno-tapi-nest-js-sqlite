import { createFileRoute } from '@tanstack/react-router';
import { Sparkles, Code2 } from 'lucide-react';

export const Route = createFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-xl shadow-md shadow-rose-500/20">
          🌸
        </div>
        <h1 className="text-3xl font-black text-[var(--text-main)]">
          About Kitsuno (狐の)
        </h1>
        <p className="text-xs text-[var(--text-muted)] max-w-xl mx-auto">
          An intuitive, beautiful, and developer-friendly Japanese language learning platform.
        </p>
      </div>

      <div className="sakura-card rounded-3xl p-8 space-y-6 text-xs leading-relaxed text-[var(--text-main)]">
        <div className="space-y-2">
          <h2 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Our Mission & Philosophy</span>
          </h2>
          <p>
            Kitsuno is engineered to help learners bridge the gap between basic kana memorization and authentic reading fluency. By combining mnemonic stories, audio pronunciations, stroke order animations, and custom Anki decks, learners build confidence and retain Japanese vocabulary naturally.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-base font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-2">
            <Code2 className="w-4 h-4" />
            <span>Modern Tech Stack</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1 text-[var(--text-muted)]">
            <li><strong>Frontend:</strong> TanStack Start (fullstack SSR with Vite)</li>
            <li><strong>Data &amp; State:</strong> TanStack Query (server state) + TanStack DB (reactive local collections)</li>
            <li><strong>UI Architecture:</strong> TanStack Table, TanStack Form, and Tailwind CSS Traditional Sakura Theme</li>
            <li><strong>Backend:</strong> NestJS 11 with TypeORM, Passport session auth, and Swagger OpenAPI</li>
            <li><strong>Dictionary:</strong> Jotoba API integration for real sentence context</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
