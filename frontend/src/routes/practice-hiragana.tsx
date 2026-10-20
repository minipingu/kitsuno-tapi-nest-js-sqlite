import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Trophy, Flame } from 'lucide-react';
import { quizHistoryCollection } from '@/lib/db';

export const Route = createFileRoute('/practice-hiragana')({
  component: PracticeHiraganaPage,
});

interface KanaItem {
  id: number;
  character: string;
  romaji: string;
}

function PracticeHiraganaPage() {
  const [deck, setDeck] = useState<KanaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['characters', 'hiragana', 'grouped'],
    queryFn: async () => {
      const res = await api.get('/api/hiragana/grouped');
      return res.data;
    },
  });

  useEffect(() => {
    if (data?.raw && data.raw.length > 0) {
      restartQuiz(data.raw);
    }
  }, [data]);

  const restartQuiz = (rawList?: KanaItem[]) => {
    const source = rawList || data?.raw || [];
    const shuffled = [...source].sort(() => Math.random() - 0.5).slice(0, 20);
    setDeck(shuffled);
    setCurrentIndex(0);
    setInputVal('');
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setFeedback(null);
    setIsFinished(false);
  };

  const currentItem = deck[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentItem || feedback) return;

    const trimmed = inputVal.trim().toLowerCase();
    const isCorrect = trimmed === currentItem.romaji.toLowerCase();

    if (isCorrect) {
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setFeedback('correct');
    } else {
      setStreak(0);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setInputVal('');
      if (currentIndex + 1 < deck.length) {
        setCurrentIndex((i) => i + 1);
      } else {
        finishQuiz(score + (isCorrect ? 1 : 0), deck.length);
      }
    }, 900);
  };

  const finishQuiz = (finalScore: number, total: number) => {
    setIsFinished(true);
    // Record to TanStack DB
    try {
      quizHistoryCollection.insert({
        id: `quiz_${Date.now()}`,
        type: 'hiragana',
        score: finalScore,
        total,
        accuracy: Math.round((finalScore / total) * 100),
        date: new Date().toLocaleDateString(),
      });
    } catch { }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <Link
          to="/hiragana"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; Back to Hiragana Chart</span>
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold">
          🌸 Hiragana Drill
        </span>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-[var(--text-muted)] animate-pulse">
          Loading quiz items...
        </div>
      ) : isFinished ? (
        <div className="sakura-card rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/25">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-[var(--text-main)]">
              Quiz Completed! お疲れ様でした！
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Your results have been automatically recorded into TanStack DB.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
            <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-sakura)]">
              <span className="text-[10px] text-gray-500 uppercase">Score</span>
              <p className="text-xl font-bold text-rose-600 dark:text-rose-400">
                {score} / {deck.length}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-sakura)]">
              <span className="text-[10px] text-gray-500 uppercase">Accuracy</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round((score / deck.length) * 100)}%
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-sakura)]">
              <span className="text-[10px] text-gray-500 uppercase">Max Streak</span>
              <p className="text-xl font-bold text-amber-500">
                {maxStreak}🔥
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => restartQuiz()}
              className="sakura-btn-primary px-6 py-2.5 rounded-2xl text-xs font-bold flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>
            <Link
              to="/hiragana"
              className="px-6 py-2.5 rounded-2xl text-xs font-bold border border-[var(--border-sakura)] hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              Return to Chart
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress bar and stats */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>
              Question <strong>{currentIndex + 1}</strong> of {deck.length}
            </span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1 text-amber-500 font-bold">
                <Flame className="w-4 h-4" />
                <span>{streak} Streak</span>
              </span>
              <span>Score: <strong>{score}</strong></span>
            </div>
          </div>

          <div className="w-full bg-[var(--bg-subtle)] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 to-pink-400 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
            />
          </div>

          {/* Drill Question Card */}
          <div className="sakura-card rounded-3xl p-10 text-center space-y-6 relative overflow-hidden">
            <div className="text-7xl font-black text-[var(--text-main)] font-japanese py-4 select-none">
              {currentItem?.character}
            </div>

            <form onSubmit={handleSubmit} className="max-w-xs mx-auto space-y-4">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Type romaji (e.g. ka, shi, tsu)..."
                  disabled={feedback !== null}
                  className={`w-full py-3 px-4 text-center text-lg font-bold rounded-2xl border transition-all focus:outline-none focus:ring-2 ${feedback === 'correct'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-600'
                    : feedback === 'wrong'
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 text-rose-600'
                      : 'border-[var(--border-sakura)] bg-[var(--bg-card)] focus:ring-rose-500'
                    }`}
                />
              </div>

              {feedback && (
                <div className="animate-in fade-in flex items-center justify-center space-x-1.5 text-xs font-bold">
                  {feedback === 'correct' ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Correct! 正解!</span>
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center space-x-1">
                      <XCircle className="w-4 h-4" />
                      <span>Answer: <strong>{currentItem.romaji}</strong></span>
                    </span>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={feedback !== null || !inputVal.trim()}
                className="w-full sakura-btn-primary py-2.5 rounded-xl font-bold text-xs disabled:opacity-50"
              >
                Submit Answer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
