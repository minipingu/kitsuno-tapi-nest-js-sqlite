import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { Search, Volume2, AlertCircle } from 'lucide-react';

export const Route = createFileRoute('/vocabulary')({
  component: VocabularyPage,
});

interface SentenceResult {
  content: string;
  furigana?: string;
  translation?: string;
  eng?: string;
}

function VocabularyPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SentenceResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const searchMutation = useMutation({
    mutationFn: async (keyword: string) => {
      const res = await api.post('/api/vocabulary/search', { query: keyword });
      return res.data?.sentences || [];
    },
    onSuccess: (data) => {
      setResults(data);
      setHasSearched(true);
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchMutation.mutate(query.trim());
  };

  const playAudio = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[var(--border-sakura)] space-y-2">
        <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
          <span>🌸 Real-World Sentences &amp; Dictionary</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--text-main)]">
          Vocabulary Search <span className="text-xl font-normal text-rose-500 font-japanese">語彙</span>
        </h1>
        <p className="text-xs text-[var(--text-muted)]">
          Search words, Kanji, or English to see natural example sentences powered by the Jotoba dictionary API.
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search in Japanese (e.g. 猫, taberu) or English (e.g. cat, eat)..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={searchMutation.isPending || !query.trim()}
          className="sakura-btn-primary px-6 py-3 rounded-2xl font-bold text-xs disabled:opacity-50"
        >
          {searchMutation.isPending ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Results Container */}
      {searchMutation.isPending ? (
        <div className="py-20 text-center text-xs text-[var(--text-muted)] animate-pulse">
          Searching Jotoba Japanese dictionary...
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="sakura-card max-w-md mx-auto rounded-3xl p-8 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-[var(--text-main)]">No Sentence Examples Found</h3>
          <p className="text-xs text-[var(--text-muted)]">
            Try searching for a different keyword, kanji, or english term.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((item, idx) => (
            <div
              key={idx}
              className="sakura-card rounded-3xl p-5 space-y-3 group hover:scale-[1.01]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-lg font-bold text-[var(--text-main)] font-japanese">
                    {item.content}
                  </div>
                  {item.furigana && item.furigana !== item.content && (
                    <div className="text-xs text-rose-600 dark:text-rose-400 font-japanese">
                      {item.furigana}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => playAudio(item.content)}
                  className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Listen"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 border-t border-[var(--border-sakura)] text-xs text-[var(--text-muted)] font-medium">
                {item.translation || item.eng || '-'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
