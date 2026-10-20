import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useAuth } from '@/context/AuthContext';
import {
  Sparkles,
  ChevronDown,
  ArrowRight,
  Bookmark,
  Trophy,
} from 'lucide-react';
import { bookmarksCollection, quizHistoryCollection } from '@/lib/db';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // TanStack DB collection counts
  const bookmarkCount = Object.keys(bookmarksCollection.state || {}).length;
  const quizCount = Object.keys(quizHistoryCollection.state || {}).length;

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is Kitsuno (狐の)?',
      a: 'Kitsuno is a modern, full-stack Japanese learning platform built with TanStack Start, TanStack Query, and TanStack DB, styled in a traditional Japanese Sakura aesthetic.',
    },
    {
      q: 'Can I export my flashcards to Anki?',
      a: 'Yes! Kitsuno lets you create personalized Kanji flashcards and export them directly as Anki (.apkg), CSV, or JSON decks.',
    },
    {
      q: 'Do I need an account to study?',
      a: 'All Kana charts (Hiragana & Katakana), Kanji references, Vocabulary sentence searches, and Particles are 100% free and open to everyone without an account!',
    },
    {
      q: 'How does TanStack DB enhance my study experience?',
      a: 'TanStack DB maintains live, reactive local collections directly in your browser, enabling instant offline bookmarking, quiz history tracking, and zero-latency UI updates.',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-rose-50 dark:bg-rose-950/60 border border-[var(--border-sakura)] text-rose-600 dark:text-rose-300 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
            <span className="text-sm">🌸</span>
            <span>Traditional Japanese Learning &bull; TanStack Edition</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight">
            Master Japanese with{' '}
            <span className="sakura-gradient-text">Kitsuno 狐の</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            Immerse yourself in Hiragana, Katakana, Kanji, and grammar particles with audio pronunciations, mnemonic stories, and Anki-compatible flashcard decks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/hiragana"
              className="sakura-btn-primary px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-rose-500/25 flex items-center space-x-2"
            >
              <span>Start Learning Hiragana</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/kanji"
              className="px-6 py-3 rounded-2xl font-bold text-sm border border-[var(--border-sakura)] bg-[var(--bg-card)] hover:border-rose-400 text-[var(--text-main)] shadow-sm transition-all"
            >
              Explore Kanji Dictionary
            </Link>

            {isAuthenticated ? (
              <Link
                to="/flashcards"
                className="px-6 py-3 rounded-2xl font-bold text-sm bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 hover:bg-rose-200 transition-colors"
              >
                My Study Decks
              </Link>
            ) : (
              <Link
                to="/register"
                className="px-6 py-3 rounded-2xl font-bold text-sm bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 hover:bg-rose-200 transition-colors"
              >
                Join Kitsuno Free
              </Link>
            )}
          </div>

          {/* TanStack DB Live Stats Bar */}
          <div className="pt-6 flex flex-wrap justify-center gap-6 text-xs text-[var(--text-muted)]">
            <div className="flex items-center space-x-1.5 bg-[var(--bg-card)] px-3 py-1.5 rounded-xl border border-[var(--border-sakura)]">
              <Bookmark className="w-3.5 h-3.5 text-rose-500" />
              <span>TanStack DB Bookmarks: <strong>{bookmarkCount}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 bg-[var(--bg-card)] px-3 py-1.5 rounded-xl border border-[var(--border-sakura)]">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>Quiz Sessions Completed: <strong>{quizCount}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 bg-[var(--bg-card)] px-3 py-1.5 rounded-xl border border-[var(--border-sakura)]">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>TanStack Start SSR + Query</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
            Complete Japanese Curriculum
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Everything you need from day one through advanced JLPT preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Kana Card */}
          <div className="sakura-card rounded-3xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 flex items-center justify-center font-bold text-xl">
              あ / ア
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Hiragana & Katakana</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Master all 46 basic characters plus Dakuten and Yōon combinations. Includes native audio, stroke guides, and mnemonic memory stories.
            </p>
            <div className="flex gap-3 pt-2">
              <Link to="/hiragana" className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                Hiragana Chart &rarr;
              </Link>
              <Link to="/katakana" className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                Katakana Chart &rarr;
              </Link>
            </div>
          </div>

          {/* Kanji Card */}
          <div className="sakura-card rounded-3xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold text-xl">
              漢
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Kanji Dictionary</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Explore Joyo Kanji grouped by elementary grade. View Onyomi, Kunyomi, meanings, stroke orders, and build custom flashcard pairs.
            </p>
            <div className="flex gap-3 pt-2">
              <Link to="/kanji" className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                Browse Kanji &rarr;
              </Link>
            </div>
          </div>

          {/* Flashcards Card */}
          <div className="sakura-card rounded-3xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold text-xl">
              札
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Study Flashcards & Anki</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Create customizable flashcards with custom notes and vocabulary pairs. Practice with 3D flip cards and export to Anki (.apkg) or CSV.
            </p>
            <div className="flex gap-3 pt-2">
              <Link to="/flashcards" className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                Open Flashcards &rarr;
              </Link>
            </div>
          </div>

          {/* Particles Card */}
          <div className="sakura-card rounded-3xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold text-xl">
              助
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Grammar Particles (助詞)</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Understand essential Japanese particles like は, が, を, に, で with clear grammar rules and natural sentence examples.
            </p>
            <div className="flex gap-3 pt-2">
              <Link to="/particles" className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                Explore Particles &rarr;
              </Link>
            </div>
          </div>

          {/* Vocabulary Card */}
          <div className="sakura-card rounded-3xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xl">
              語
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Vocabulary & Jotoba</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Search real-world words and sentence examples with furigana readings and English translations powered by Jotoba dictionary integration.
            </p>
            <div className="flex gap-3 pt-2">
              <Link to="/vocabulary" className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                Search Vocabulary &rarr;
              </Link>
            </div>
          </div>

          {/* Practice Quizzes */}
          <div className="sakura-card rounded-3xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xl">
              問
            </div>
            <h3 className="text-lg font-bold text-[var(--text-main)]">Interactive Quizzes</h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Test your recall speed with Kana typing drills. Track your high scores and accuracy live with TanStack DB persistence.
            </p>
            <div className="flex gap-3 pt-2">
              <Link to="/practice-hiragana" className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                Hiragana Quiz &rarr;
              </Link>
              <Link to="/practice-katakana" className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                Katakana Quiz &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Common questions about Kitsuno and Japanese study tools.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="sakura-card rounded-2xl overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-semibold text-sm text-[var(--text-main)]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-rose-500 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''
                    }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-[var(--text-muted)] leading-relaxed border-t border-[var(--border-sakura)] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
