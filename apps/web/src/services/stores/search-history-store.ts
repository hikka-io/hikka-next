import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_HISTORY_ENTRIES = 10;
const HISTORY_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface SearchHistoryEntry {
    query: string;
    timestamp: number;
}

const isEntryFresh = (entry: SearchHistoryEntry) =>
    Date.now() - entry.timestamp < HISTORY_TTL_MS;

export interface SearchHistoryState {
    entries: SearchHistoryEntry[];
}

export interface SearchHistoryActions {
    addEntry: (query: string) => void;
    removeEntry: (query: string) => void;
    clearHistory: () => void;
}

export type SearchHistoryStore = SearchHistoryState & SearchHistoryActions;

export const useSearchHistoryStore = create<SearchHistoryStore>()(
    persist(
        (set) => ({
            entries: [],
            addEntry: (query) =>
                set((state) => {
                    const normalized = query.trim();
                    if (!normalized) return state;

                    return {
                        entries: [
                            { query: normalized, timestamp: Date.now() },
                            // Dedupe by query text, freshest entry stays on
                            // top; drop entries older than the TTL
                            ...state.entries.filter(
                                (entry) =>
                                    entry.query.toLowerCase() !==
                                        normalized.toLowerCase() &&
                                    isEntryFresh(entry),
                            ),
                        ].slice(0, MAX_HISTORY_ENTRIES),
                    };
                }),
            removeEntry: (query) =>
                set((state) => ({
                    entries: state.entries.filter(
                        (entry) => entry.query !== query,
                    ),
                })),
            clearHistory: () => set({ entries: [] }),
        }),
        {
            name: 'search-history', // localStorage key
            merge: (persistedState, currentState) => {
                const persisted = persistedState as Partial<SearchHistoryState>;

                return {
                    ...currentState,
                    ...persisted,
                    // Drop entries older than the TTL on every load
                    entries: (persisted?.entries ?? []).filter(isEntryFresh),
                };
            },
        },
    ),
);
