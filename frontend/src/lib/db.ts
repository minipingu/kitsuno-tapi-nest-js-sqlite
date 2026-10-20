import {
  createCollection,
  localStorageCollectionOptions,
} from '@tanstack/react-db';

export interface BookmarkItem {
  id: string;
  type: 'hiragana' | 'katakana' | 'kanji';
  character: string;
  romajiOrMeaning: string;
  savedAt: string;
}

export interface QuizResultItem {
  id: string;
  type: 'hiragana' | 'katakana';
  score: number;
  total: number;
  accuracy: number;
  date: string;
}

const memoryStorage = {
  getItem: () => null,
  setItem: () => { },
  removeItem: () => { },
};

export const bookmarksCollection = createCollection(
  localStorageCollectionOptions<BookmarkItem>({
    id: 'kitsuno_bookmarks',
    storageKey: 'kitsuno_bookmarks_db',
    storage:
      typeof window !== 'undefined' && window.localStorage
        ? window.localStorage
        : memoryStorage,
    getKey: (item) => item.id,
  }),
);

export const quizHistoryCollection = createCollection(
  localStorageCollectionOptions<QuizResultItem>({
    id: 'kitsuno_quiz_history',
    storageKey: 'kitsuno_quiz_history_db',
    storage:
      typeof window !== 'undefined' && window.localStorage
        ? window.localStorage
        : memoryStorage,
    getKey: (item) => item.id,
  }),
);
