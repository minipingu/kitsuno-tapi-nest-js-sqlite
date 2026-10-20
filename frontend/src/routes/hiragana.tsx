import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Volume2, Gamepad2, X, Bookmark } from 'lucide-react';
import { bookmarksCollection } from '@/lib/db';

export const Route = createFileRoute('/hiragana')({
  component: HiraganaPage,
});

interface KanaItem {
  id: number;
  character: string;
  romaji: string;
  audio?: string;
  mnemonic?: string;
  story?: string;
  strokeOrder?: string;
}

function HiraganaPage() {
  const [activeTab, setActiveTab] = useState<'main' | 'dakuten' | 'yoon'>('main');
  const [selectedKana, setSelectedKana] = useState<KanaItem | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ['characters', 'hiragana', 'grouped'],
    queryFn: async () => {
      const res = await api.get('/api/hiragana/grouped');
      return res.data;
    },
  });

  const kanaList: KanaItem[] = data?.raw || [];
  const variants = data?.variants || { dakuten: [], yoon: [] };

  const playAudio = (item: { character: string; audio?: string }) => {
    if (item.audio) {
      const audio = new Audio(item.audio);
      audio.play().catch(() => speakKana(item.character));
    } else {
      speakKana(item.character);
    }
  };

  const speakKana = (character: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(character);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBookmark = (e: React.MouseEvent, kana: KanaItem) => {
    e.stopPropagation();
    const id = `hiragana_${kana.id}`;
    if (bookmarkedIds[id]) {
      try {
        bookmarksCollection.delete(id);
      } catch { }
      setBookmarkedIds({ ...bookmarkedIds, [id]: false });
    } else {
      try {
        bookmarksCollection.insert({
          id,
          type: 'hiragana',
          character: kana.character,
          romajiOrMeaning: kana.romaji,
          savedAt: new Date().toISOString(),
        });
      } catch { }
      setBookmarkedIds({ ...bookmarkedIds, [id]: true });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-sakura)]">
        <div>
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <span>🌸 Basic Japanese Alphabet</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)]">
            Hiragana Chart <span className="text-xl font-normal text-rose-500 font-japanese">平仮名</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Tap any character card to hear native pronunciation and read mnemonic stories.
          </p>
        </div>

        <Link
          to="/practice-hiragana"
          className="sakura-btn-primary inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-rose-500/20 self-start md:self-auto"
        >
          <Gamepad2 className="w-4 h-4" />
          <span>Interactive Quiz Drill</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[var(--border-sakura)]">
        <button
          type="button"
          onClick={() => setActiveTab('main')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${activeTab === 'main'
            ? 'border-rose-600 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30'
            : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
        >
          Gojūon 五十音 ({kanaList.length || 46})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dakuten')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${activeTab === 'dakuten'
            ? 'border-rose-600 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30'
            : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
        >
          Dakuten 濁音 ({variants.dakuten?.length || 25})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('yoon')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-xl transition-all border-b-2 ${activeTab === 'yoon'
            ? 'border-rose-600 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30'
            : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
        >
          Yōon 拗音 ({variants.yoon?.length || 36})
        </button>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[var(--text-muted)] animate-pulse">
          Loading Hiragana from backend...
        </div>
      ) : activeTab === 'main' ? (
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {kanaList.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedKana(item)}
              className="sakura-card relative rounded-2xl p-4 text-center cursor-pointer group hover:scale-105"
            >
              <div className="text-3xl font-black text-[var(--text-main)] group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                {item.character}
              </div>
              <div className="text-xs font-semibold text-rose-500 dark:text-rose-400 mt-1">
                {item.romaji}
              </div>

              <div className="flex justify-center items-center gap-2 mt-3 opacity-80 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(item);
                  }}
                  className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-gray-400 hover:text-rose-600"
                  title="Listen"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleBookmark(e, item)}
                  className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/40 text-gray-400 hover:text-amber-500"
                  title="Bookmark (TanStack DB)"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds[`hiragana_${item.id}`] ? 'text-amber-500 fill-amber-500' : ''}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'dakuten' ? (
        <div className="grid grid-cols-5 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {variants.dakuten?.map((item: any, idx: number) => (
            <div
              key={idx}
              onClick={() => playAudio(item)}
              className="sakura-card rounded-2xl p-4 text-center cursor-pointer group hover:scale-105"
            >
              <div className="text-3xl font-black text-[var(--text-main)] group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                {item.character}
              </div>
              <div className="text-xs font-semibold text-rose-500 dark:text-rose-400 mt-1">
                {item.romaji}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-w-4xl mx-auto">
          {variants.yoon?.map((item: any, idx: number) => (
            <div
              key={idx}
              onClick={() => playAudio(item)}
              className="sakura-card rounded-2xl p-4 text-center cursor-pointer group hover:scale-105"
            >
              <div className="text-2xl font-black text-[var(--text-main)] group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                {item.character}
              </div>
              <div className="text-xs font-semibold text-rose-500 dark:text-rose-400 mt-1">
                {item.romaji}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mnemonic Details Modal */}
      {selectedKana && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="sakura-card max-w-md w-full rounded-3xl p-6 space-y-5 relative">
            <button
              type="button"
              onClick={() => setSelectedKana(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-5xl font-black shadow-lg shadow-rose-500/25">
                {selectedKana.character}
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                  Hiragana &bull; 平仮名
                </span>
                <h3 className="text-2xl font-extrabold text-[var(--text-main)]">
                  {selectedKana.romaji}
                </h3>
                <button
                  type="button"
                  onClick={() => playAudio(selectedKana)}
                  className="mt-1 inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 font-semibold text-xs hover:bg-rose-100 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Pronounce</span>
                </button>
              </div>
            </div>

            {selectedKana.mnemonic && (
              <div className="rounded-2xl overflow-hidden border border-[var(--border-sakura)] bg-black/5 dark:bg-black/30">
                <img
                  src={selectedKana.mnemonic}
                  alt={selectedKana.romaji}
                  className="w-full max-h-48 object-contain mx-auto p-2"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {selectedKana.story && (
              <div className="space-y-1 bg-rose-50/50 dark:bg-rose-950/20 p-4 rounded-2xl border border-[var(--border-sakura)]">
                <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  Mnemonic Memory Story
                </p>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {selectedKana.story}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedKana(null)}
                className="sakura-btn-primary px-5 py-2 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
