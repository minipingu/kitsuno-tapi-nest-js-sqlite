import { useState, useMemo } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react';
import { bookmarksCollection } from '@/lib/db';

export const Route = createFileRoute('/kanji/')({
  component: KanjiListPage,
});

interface KanjiItem {
  id: number;
  character: string;
  strokeCount: number;
  grade: number;
  meanings: string;
  onyomiReadings: string[];
  kunyomiReadings: string[];
}

const columnHelper = createColumnHelper<KanjiItem>();

function KanjiListPage() {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');
  const [sorting, setSorting] = useState<SortingState>([{ id: 'grade', desc: false }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  const { data: kanjiList = [], isLoading } = useQuery({
    queryKey: ['characters', 'kanji'],
    queryFn: async () => {
      const res = await api.get('/api/kanji');
      return (res.data || []) as KanjiItem[];
    },
  });

  const handleBookmark = (e: React.MouseEvent, kanji: KanjiItem) => {
    e.stopPropagation();
    const id = `kanji_${kanji.id}`;
    if (bookmarkedIds[id]) {
      try {
        bookmarksCollection.delete(id);
      } catch { }
      setBookmarkedIds({ ...bookmarkedIds, [id]: false });
    } else {
      try {
        bookmarksCollection.insert({
          id,
          type: 'kanji',
          character: kanji.character,
          romajiOrMeaning: kanji.meanings,
          savedAt: new Date().toISOString(),
        });
      } catch { }
      setBookmarkedIds({ ...bookmarkedIds, [id]: true });
    }
  };

  // TanStack Table Column Definitions
  const columns = useMemo(
    () => [
      columnHelper.accessor('character', {
        header: 'Character 漢字',
        cell: (info) => (
          <Link
            to="/kanji/$character"
            params={{ character: info.getValue() }}
            className="flex items-center space-x-2 font-bold hover:text-rose-600 dark:hover:text-rose-400 group"
          >
            <span className="text-2xl font-japanese group-hover:scale-110 transition-transform">
              {info.getValue()}
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600">
              {info.row.original.strokeCount}画
            </span>
          </Link>
        ),
      }),
      columnHelper.accessor('grade', {
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center space-x-1 hover:text-rose-500"
          >
            <span>Grade 学年</span>
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
        ),
        cell: (info) => (
          <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-sakura)]">
            Grade {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('meanings', {
        header: 'Meanings 意味',
        cell: (info) => (
          <span className="text-xs text-[var(--text-main)] font-medium">
            {info.getValue() || '-'}
          </span>
        ),
      }),
      columnHelper.accessor('onyomiReadings', {
        header: 'Onyomi 音読み',
        cell: (info) => (
          <span className="text-xs text-rose-600 dark:text-rose-400 font-japanese">
            {info.getValue()?.join('、 ') || '-'}
          </span>
        ),
      }),
      columnHelper.accessor('kunyomiReadings', {
        header: 'Kunyomi 訓読み',
        cell: (info) => (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-japanese">
            {info.getValue()?.join('、 ') || '-'}
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
              params={{ character: info.row.original.character }}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors"
            >
              Study
            </Link>
            <button
              type="button"
              onClick={(e) => handleBookmark(e, info.row.original)}
              className="p-1 text-gray-400 hover:text-amber-500"
              title="Bookmark"
            >
              <Bookmark
                className={`w-4 h-4 ${bookmarkedIds[`kanji_${info.row.original.id}`]
                  ? 'text-amber-500 fill-amber-500'
                  : ''
                  }`}
              />
            </button>
          </div>
        ),
      }),
    ],
    [bookmarkedIds],
  );

  const table = useReactTable({
    data: kanjiList,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[var(--border-sakura)]">
        <div>
          <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-semibold text-xs uppercase tracking-wider">
            <span>🌸 Joyo Kanji Curriculum</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)]">
            Kanji Dictionary <span className="text-xl font-normal text-rose-500 font-japanese">漢字</span>
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Browse elementary Japanese characters with TanStack Table and create custom flashcards.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center space-x-2 bg-[var(--bg-subtle)] p-1 rounded-2xl border border-[var(--border-sakura)]">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'grid'
              ? 'bg-[var(--bg-card)] shadow-sm text-rose-600 dark:text-rose-400'
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${viewMode === 'table'
              ? 'bg-[var(--bg-card)] shadow-sm text-rose-600 dark:text-rose-400'
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>TanStack Table</span>
          </button>
        </div>
      </div>

      {/* Global Filter Search */}
      <div className="flex items-center space-x-3 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search character, meaning, reading..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs bg-[var(--bg-card)] border border-[var(--border-sakura)] focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-sm"
          />
        </div>
        <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">
          {table.getFilteredRowModel().rows.length} characters
        </span>
      </div>

      {/* Content Rendering */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[var(--text-muted)] animate-pulse">
          Loading Kanji database...
        </div>
      ) : viewMode === 'table' ? (
        /* TanStack Table View */
        <div className="space-y-4">
          <div className="sakura-card rounded-3xl overflow-hidden border border-[var(--border-sakura)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-sakura)] text-gray-600 dark:text-gray-300 font-bold uppercase tracking-wider">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th key={header.id} className="p-4">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-[var(--border-sakura)]">
                  {table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-rose-50/40 dark:hover:bg-rose-950/20 transition-colors"
                    >
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

          {/* Table Pagination */}
          <div className="flex items-center justify-between px-2 text-xs text-[var(--text-muted)]">
            <div className="flex items-center space-x-2">
              <span>Page</span>
              <strong>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
              </strong>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="p-1.5 rounded-xl border border-[var(--border-sakura)] disabled:opacity-40 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="p-1.5 rounded-xl border border-[var(--border-sakura)] disabled:opacity-40 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Grid Card View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {table.getFilteredRowModel().rows.map((row) => {
            const kanji = row.original;
            return (
              <Link
                key={kanji.id}
                to="/kanji/$character"
                params={{ character: kanji.character }}
                className="sakura-card rounded-3xl p-5 text-center flex flex-col justify-between group hover:scale-105 transition-all"
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] text-gray-400 mb-2">
                    <span className="font-semibold text-rose-500">Grade {kanji.grade}</span>
                    <span>{kanji.strokeCount}画</span>
                  </div>
                  <div className="text-5xl font-black text-[var(--text-main)] font-japanese group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors py-2">
                    {kanji.character}
                  </div>
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-300 line-clamp-1 mt-1">
                    {kanji.meanings || '-'}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-sakura)] text-[10px] text-rose-600 dark:text-rose-400 font-japanese truncate">
                  {kanji.onyomiReadings?.[0] || kanji.kunyomiReadings?.[0] || ''}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
