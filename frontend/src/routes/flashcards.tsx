import { useState, useMemo } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { API_BASE_URL } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import {
  Trash2,
  ExternalLink,
  RotateCw,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileJson,
  Package,
} from 'lucide-react';

export const Route = createFileRoute('/flashcards')({
  component: FlashcardsPage,
});

interface FlashcardItem {
  id: number;
  kanjiCharacter: string;
  kanjiGrade: number;
  kanjiMeanings: string;
  onyomiReadings: string[];
  kunyomiReadings: string[];
  vocabulary: string[];
  notes: string;
}

const columnHelper = createColumnHelper<FlashcardItem>();

function FlashcardsPage() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [viewMode, setViewMode] = useState<'study' | 'table'>('study');

  // Query flashcards with TanStack Query
  const { data: flashcards = [], isLoading } = useQuery({
    queryKey: ['flashcards'],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const res = await api.get('/api/flashcards');
      return (res.data || []) as FlashcardItem[];
    },
    enabled: isAuthenticated,
  });

  // Delete flashcard mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/flashcards/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcards'] });
    },
  });

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this flashcard?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  // TanStack Table setup
  const columns = useMemo(
    () => [
      columnHelper.accessor('kanjiCharacter', {
        header: 'Kanji',
        cell: (info) => (
          <Link
            to="/kanji/$character"
            params={{ character: info.getValue() }}
            className="text-2xl font-bold font-japanese text-rose-600 dark:text-rose-400 hover:scale-110 inline-block transition-transform"
          >
            {info.getValue()}
          </Link>
        ),
      }),
      columnHelper.accessor('kanjiMeanings', {
        header: 'Meanings',
        cell: (info) => (
          <span className="text-xs font-semibold text-[var(--text-main)]">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('vocabulary', {
        header: 'Vocabulary Pairs',
        cell: (info) => (
          <div className="space-y-0.5 text-xs">
            {info.getValue()?.map((v, i) => (
              <div key={i} className="text-gray-600 dark:text-gray-300">
                &bull; {v}
              </div>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor('notes', {
        header: 'Notes',
        cell: (info) => (
          <span className="text-xs text-[var(--text-muted)] italic">
            {info.getValue() || '-'}
          </span>
        ),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Action',
        cell: (info) => (
          <div className="flex items-center space-x-2">
            <Link
              to="/kanji/$character"
              params={{ character: info.row.original.kanjiCharacter }}
              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              title="Edit"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(info.row.original.id)}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      }),
    ],
    [],
  );

  const table = useReactTable({
    data: flashcards,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center text-3xl">
          🌸
        </div>
        <h2 className="text-2xl font-extrabold text-[var(--text-main)]">
          Sign In to Access Your Flashcards
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          Create, study, and export custom Kanji flashcards with Anki compatibility.
        </p>
        <Link
          to="/login"
          className="sakura-btn-primary inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl font-bold text-xs"
        >
          <span>Log In to Your Account</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const currentCard = flashcards[activeCardIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header and Exports */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-sakura)]">
        <div>
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <span>🌸 Study Decks</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)]">
            Kanji Flashcards <span className="text-xl font-normal text-rose-500 font-japanese">単語カード</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            You have <strong>{flashcards.length}</strong> active flashcards in your deck.
          </p>
        </div>

        {/* Exports */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`${API_BASE_URL}/api/flashcards/export/csv`}
            download
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-subtle)] border border-[var(--border-sakura)] hover:border-rose-400 text-gray-700 dark:text-gray-200"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </a>
          <a
            href={`${API_BASE_URL}/api/flashcards/export/json`}
            download
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-subtle)] border border-[var(--border-sakura)] hover:border-rose-400 text-gray-700 dark:text-gray-200"
          >
            <FileJson className="w-3.5 h-3.5 text-blue-600" />
            <span>JSON</span>
          </a>
          <a
            href={`${API_BASE_URL}/api/flashcards/export/anki`}
            download
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[var(--bg-subtle)] border border-[var(--border-sakura)] hover:border-rose-400 text-gray-700 dark:text-gray-200"
          >
            <Package className="w-3.5 h-3.5 text-rose-600" />
            <span>Anki (.apkg)</span>
          </a>

          <Link
            to="/kanji"
            className="sakura-btn-primary flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold"
          >
            <span>+ Add Kanji</span>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-[var(--text-muted)] animate-pulse">
          Loading flashcards...
        </div>
      ) : flashcards.length === 0 ? (
        <div className="sakura-card max-w-md mx-auto rounded-3xl p-8 text-center space-y-4">
          <div className="text-4xl">🌸</div>
          <h3 className="text-lg font-bold text-[var(--text-main)]">No Flashcards Yet</h3>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Browse our Kanji catalog, choose a character, and click "Create Custom Flashcard" to start building your study deck!
          </p>
          <Link
            to="/kanji"
            className="sakura-btn-primary inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl text-xs font-bold"
          >
            <span>Browse Kanji Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* View Toggle */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 bg-[var(--bg-subtle)] p-1 rounded-2xl border border-[var(--border-sakura)]">
              <button
                type="button"
                onClick={() => setViewMode('study')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'study'
                  ? 'bg-[var(--bg-card)] shadow-sm text-rose-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                3D Interactive Study Deck
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'table'
                  ? 'bg-[var(--bg-card)] shadow-sm text-rose-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                TanStack Table View
              </button>
            </div>

            {viewMode === 'study' && (
              <span className="text-xs text-[var(--text-muted)] font-medium">
                Card {activeCardIndex + 1} of {flashcards.length}
              </span>
            )}
          </div>

          {/* 3D Flip Card View */}
          {viewMode === 'study' ? (
            <div className="max-w-xl mx-auto space-y-6">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="perspective-1000 w-full h-80 cursor-pointer select-none"
              >
                <div
                  className={`relative w-full h-full rounded-3xl sakura-card transform-style-3d transition-transform duration-500 shadow-xl ${isFlipped ? 'rotate-y-180' : ''
                    }`}
                >
                  {/* Front Side */}
                  <div className="absolute inset-0 backface-hidden p-8 flex flex-col justify-between items-center text-center">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">
                      Grade {currentCard?.kanjiGrade} &bull; Tap to Flip
                    </span>

                    <div className="text-8xl font-black text-[var(--text-main)] font-japanese py-2">
                      {currentCard?.kanjiCharacter}
                    </div>

                    <p className="text-xs text-gray-400 italic">
                      Click anywhere on the card to reveal readings & vocabulary
                    </p>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-[var(--border-sakura)] pb-2">
                        <span className="text-3xl font-black text-rose-600 font-japanese">
                          {currentCard?.kanjiCharacter}
                        </span>
                        <span className="text-sm font-bold text-[var(--text-main)]">
                          {currentCard?.kanjiMeanings}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 rounded-xl bg-[var(--bg-subtle)]">
                          <span className="text-[10px] text-rose-500 font-bold block">Onyomi</span>
                          <span className="font-japanese">{currentCard?.onyomiReadings?.join('、 ') || '-'}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-[var(--bg-subtle)]">
                          <span className="text-[10px] text-emerald-500 font-bold block">Kunyomi</span>
                          <span className="font-japanese">{currentCard?.kunyomiReadings?.join('、 ') || '-'}</span>
                        </div>
                      </div>

                      {currentCard?.vocabulary?.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Vocabulary</span>
                          {currentCard.vocabulary.map((vocab, i) => (
                            <p key={i} className="text-xs font-medium text-[var(--text-main)]">
                              &bull; {vocab}
                            </p>
                          ))}
                        </div>
                      )}

                      {currentCard?.notes && (
                        <p className="text-[11px] text-[var(--text-muted)] italic bg-rose-50/50 dark:bg-rose-950/20 p-2 rounded-xl border border-[var(--border-sakura)]">
                          {currentCard.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 text-center text-[10px] text-gray-400">
                      Tap card to flip back
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsFlipped(false);
                    setActiveCardIndex((i) => (i > 0 ? i - 1 : flashcards.length - 1));
                  }}
                  className="p-3 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] hover:border-rose-400"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-5 py-2.5 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs font-bold text-rose-600 flex items-center space-x-1.5"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Flip Card</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFlipped(false);
                    setActiveCardIndex((i) => (i + 1 < flashcards.length ? i + 1 : 0));
                  }}
                  className="p-3 rounded-2xl border border-[var(--border-sakura)] bg-[var(--bg-card)] hover:border-rose-400"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                </button>
              </div>
            </div>
          ) : (
            /* TanStack Table View */
            <div className="sakura-card rounded-3xl overflow-hidden border border-[var(--border-sakura)]">
              <div className="p-4 border-b border-[var(--border-sakura)] flex items-center justify-between">
                <div className="relative max-w-xs flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search deck..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[var(--border-sakura)] bg-[var(--bg-card)] text-xs"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-sakura)] text-gray-600 dark:text-gray-300 font-bold uppercase tracking-wider">
                    {table.getHeaderGroups().map((hg) => (
                      <tr key={hg.id}>
                        {hg.headers.map((h) => (
                          <th key={h.id} className="p-4">
                            {flexRender(h.column.columnDef.header, h.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-[var(--border-sakura)]">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-rose-50/40 dark:hover:bg-rose-950/20">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="p-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
