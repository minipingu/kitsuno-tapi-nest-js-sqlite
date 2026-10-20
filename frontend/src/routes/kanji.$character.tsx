import { useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import * as wanakana from 'wanakana';
import {
  ArrowLeft,
  Volume2,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const Route = createFileRoute('/kanji/$character')({
  component: KanjiDetailPage,
});

interface KanjiDetail {
  id: number;
  character: string;
  strokeCount: number;
  grade: number;
  meanings: string;
  onyomiReadings: string[];
  kunyomiReadings: string[];
  strokeOrderSvg?: string;
}

function KanjiDetailPage() {
  const { character } = Route.useParams();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Query Kanji Details
  const { data: kanji, isLoading: isKanjiLoading } = useQuery({
    queryKey: ['kanji', character],
    queryFn: async () => {
      const res = await api.get(`/api/kanji/character/${encodeURIComponent(character)}`);
      return res.data as KanjiDetail;
    },
  });

  // 2. Query Existing Flashcard (if authenticated)
  const { data: existingFlashcard } = useQuery({
    queryKey: ['flashcards', 'by-kanji', character],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      try {
        const res = await api.get(`/api/flashcards/by-kanji/${encodeURIComponent(character)}`);
        return res.data;
      } catch {
        return null;
      }
    },
    enabled: isAuthenticated,
  });

  // 3. Mutation to Save Flashcard
  const saveFlashcardMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post('/api/flashcards', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
      queryClient.invalidateQueries({ queryKey: ['flashcards', 'by-kanji', character] });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setShowForm(false);
      }, 1500);
    },
    onError: (err: any) => {
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to save flashcard');
    },
  });

  // TanStack Form
  const form = useForm({
    defaultValues: {
      notes: existingFlashcard?.notes || '',
      vocabWord1: existingFlashcard?.vocabulary?.[0]?.split(' ')?.[0] || '',
      vocabMeaning1: existingFlashcard?.vocabulary?.[0]?.split(' ')?.[1] || '',
      vocabWord2: existingFlashcard?.vocabulary?.[1]?.split(' ')?.[0] || '',
      vocabMeaning2: existingFlashcard?.vocabulary?.[1]?.split(' ')?.[1] || '',
      vocabWord3: existingFlashcard?.vocabulary?.[2]?.split(' ')?.[0] || '',
      vocabMeaning3: existingFlashcard?.vocabulary?.[2]?.split(' ')?.[1] || '',
    },
    onSubmit: async ({ value }) => {
      if (!kanji) return;
      setErrorMessage('');
      const payload: any = {
        kanjiId: kanji.id,
        notes: value.notes.trim(),
      };
      if (value.vocabWord1 && value.vocabMeaning1) {
        payload.vocabWord1 = value.vocabWord1.trim();
        payload.vocabMeaning1 = value.vocabMeaning1.trim();
      }
      if (value.vocabWord2 && value.vocabMeaning2) {
        payload.vocabWord2 = value.vocabWord2.trim();
        payload.vocabMeaning2 = value.vocabMeaning2.trim();
      }
      if (value.vocabWord3 && value.vocabMeaning3) {
        payload.vocabWord3 = value.vocabWord3.trim();
        payload.vocabMeaning3 = value.vocabMeaning3.trim();
      }

      if (!payload.vocabWord1) {
        setErrorMessage('At least one vocabulary pair (word + meaning) is required.');
        return;
      }
      await saveFlashcardMutation.mutateAsync(payload);
    },
  });

  const speakKanji = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      window.speechSynthesis.speak(u);
    }
  };

  if (isKanjiLoading) {
    return (
      <div className="py-24 text-center text-xs text-[var(--text-muted)] animate-pulse">
        Loading character details...
      </div>
    );
  }

  if (!kanji) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold">Kanji character not found</h2>
        <Link to="/kanji" className="text-rose-600 font-semibold hover:underline">
          &larr; Back to Kanji Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/kanji"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>&larr; Back to Kanji Catalog</span>
        </Link>
      </div>

      {/* Main Character Header Card */}
      <div className="sakura-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative">
          <div className="w-36 h-36 rounded-3xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-8xl font-black font-japanese shadow-xl shadow-rose-500/25">
            {kanji.character}
          </div>
          <button
            type="button"
            onClick={() => speakKanji(kanji.character)}
            className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-sakura)] text-rose-600 hover:scale-110 transition-transform shadow-md"
            title="Pronounce"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 font-bold">
              Grade {kanji.grade}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-sakura)] text-gray-600 dark:text-gray-300 font-medium">
              {kanji.strokeCount} Strokes (画数)
            </span>
            {existingFlashcard && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>In Flashcard Deck</span>
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)]">
            {kanji.meanings}
          </h1>

          {/* Readings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-sakura)]">
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                Onyomi 音読み (Chinese Reading)
              </span>
              <p className="text-lg font-bold text-rose-600 dark:text-rose-400 font-japanese mt-1">
                {kanji.onyomiReadings?.join('、 ') || '-'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-sakura)]">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                Kunyomi 訓読み (Japanese Reading)
              </span>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-japanese mt-1">
                {kanji.kunyomiReadings?.join('、 ') || '-'}
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="sakura-btn-primary px-6 py-2.5 rounded-2xl font-bold text-xs inline-flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{existingFlashcard ? 'Edit Flashcard' : 'Create Custom Flashcard'}</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center space-x-1.5 text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
              >
                <span>Log in to save this character to your flashcard deck &rarr;</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* TanStack Form: Flashcard Creator */}
      {showForm && (
        <div className="sakura-card rounded-3xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-[var(--border-sakura)] pb-4">
            <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center space-x-2">
              <span>🌸</span>
              <span>Customize Flashcard for {kanji.character}</span>
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Add vocabulary pairs and study notes. Japanese inputs automatically convert romaji to Hiragana (Wanakana IME).
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Flashcard saved successfully!</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Notes Field */}
            <form.Field
              name="notes"
              children={(field) => (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    Mnemonic Notes / Personal Hints
                  </label>
                  <textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    rows={2}
                    placeholder="e.g. Looks like a sun rising between two mountain ridges..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
                  />
                </div>
              )}
            />

            {/* Vocabulary Pairs */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200">
                Vocabulary Word & Meaning Pairs
              </h4>

              {/* Pair 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <form.Field
                  name="vocabWord1"
                  children={(field) => (
                    <input
                      type="text"
                      placeholder="Word 1 (e.g. 日曜日)"
                      value={field.state.value}
                      onChange={(e) => {
                        const converted = wanakana.toHiragana(e.target.value, { IMEMode: true });
                        field.handleChange(converted);
                      }}
                      className="px-3.5 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs font-japanese"
                    />
                  )}
                />
                <form.Field
                  name="vocabMeaning1"
                  children={(field) => (
                    <input
                      type="text"
                      placeholder="Meaning 1 (e.g. Sunday)"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="px-3.5 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs"
                    />
                  )}
                />
              </div>

              {/* Pair 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <form.Field
                  name="vocabWord2"
                  children={(field) => (
                    <input
                      type="text"
                      placeholder="Word 2 (Optional)"
                      value={field.state.value}
                      onChange={(e) => {
                        const converted = wanakana.toHiragana(e.target.value, { IMEMode: true });
                        field.handleChange(converted);
                      }}
                      className="px-3.5 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs font-japanese"
                    />
                  )}
                />
                <form.Field
                  name="vocabMeaning2"
                  children={(field) => (
                    <input
                      type="text"
                      placeholder="Meaning 2 (Optional)"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="px-3.5 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs"
                    />
                  )}
                />
              </div>

              {/* Pair 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <form.Field
                  name="vocabWord3"
                  children={(field) => (
                    <input
                      type="text"
                      placeholder="Word 3 (Optional)"
                      value={field.state.value}
                      onChange={(e) => {
                        const converted = wanakana.toHiragana(e.target.value, { IMEMode: true });
                        field.handleChange(converted);
                      }}
                      className="px-3.5 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs font-japanese"
                    />
                  )}
                />
                <form.Field
                  name="vocabMeaning3"
                  children={(field) => (
                    <input
                      type="text"
                      placeholder="Meaning 3 (Optional)"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="px-3.5 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs"
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl border border-[var(--border-sakura)] text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saveFlashcardMutation.isPending}
                className="sakura-btn-primary px-6 py-2 rounded-xl text-xs font-bold flex items-center space-x-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saveFlashcardMutation.isPending ? 'Saving...' : 'Save Flashcard'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
