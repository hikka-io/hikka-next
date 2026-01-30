'use client';

import { ContentTypeEnum } from '@hikka/client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Preferences for persisting user UI choices across sessions.
 * Extensible structure for views, filters, and collapsibles in different contexts.
 */
export interface Preferences {
    /** View preferences by context key (e.g., 'franchise', 'userlist') */
    views: Record<string, Hikka.View>;
    /** Filter preferences by context key (e.g., 'franchiseContentTypes') */
    filters: Record<string, string[]>;
    /** Collapsible state by context key (e.g., 'content_score', 'content_progress') */
    collapsibles: Record<string, boolean>;
}

export interface SettingsState {
    editTags: string[];
    filterPresets: Hikka.FilterPreset[];
    preferences: Preferences;
    _hasHydrated: boolean;
}

export interface SettingsActions {
    setHasHydrated: (hasHydrated: boolean) => void;
    setEditTags: (editTags: string[]) => void;
    setFilterPresets: (filterPresets: Hikka.FilterPreset[]) => void;
    /** Set a view preference for a specific context */
    setViewPreference: (key: string, view: Hikka.View) => void;
    /** Set a filter preference for a specific context */
    setFilterPreference: (key: string, values: string[]) => void;
    /** Set a collapsible state for a specific context */
    setCollapsible: (key: string, open: boolean) => void;
    reset: () => void;
}

export const DEFAULT_PREFERENCES: Preferences = {
    views: {
        franchise: 'table',
        userlist: 'table',
    },
    filters: {
        franchiseContentTypes: [
            ContentTypeEnum.ANIME,
            ContentTypeEnum.MANGA,
            ContentTypeEnum.NOVEL,
        ],
    },
    collapsibles: {
        content_score: true,
        content_progress: true,
    },
};

const DEFAULT_SETTINGS: SettingsState = {
    _hasHydrated: false,
    editTags: ['Додано назву', 'Додано синоніми', 'Додано опис', 'Додано імʼя'],
    filterPresets: [
        {
            name: 'Нещодавно завершені',
            description: 'Завершені аніме попереднього сезону',
            content_types: ['anime'],
            statuses: ['finished'],
            date_range_enabled: true,
            date_range: [-1, 0],
            id: 'ffc33695-017c-4404-9c5d-7b76864a6cfb',
        },
    ],
    preferences: DEFAULT_PREFERENCES,
};

export type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state,
                });
            },
            setEditTags: (editTags) => set({ editTags }),
            setFilterPresets: (filterPresets) => set({ filterPresets }),
            setViewPreference: (key, view) =>
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        views: {
                            ...state.preferences.views,
                            [key]: view,
                        },
                    },
                })),
            setFilterPreference: (key, values) =>
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        filters: {
                            ...state.preferences.filters,
                            [key]: values,
                        },
                    },
                })),
            setCollapsible: (key, open) =>
                set((state) => ({
                    preferences: {
                        ...state.preferences,
                        collapsibles: {
                            ...state.preferences.collapsibles,
                            [key]: open,
                        },
                    },
                })),
            reset: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: 'settings', // localStorage key
            onRehydrateStorage: (state) => {
                return () => state.setHasHydrated(true);
            },
            merge: (persistedState, currentState) => {
                const persisted = persistedState as Partial<SettingsState> & {
                    collapsibles?: Record<string, boolean>;
                };
                return {
                    ...currentState,
                    ...persisted,
                    // Deep merge preferences to handle old localStorage structure
                    preferences: {
                        views: {
                            ...DEFAULT_PREFERENCES.views,
                            ...persisted?.preferences?.views,
                        },
                        filters: {
                            ...DEFAULT_PREFERENCES.filters,
                            ...persisted?.preferences?.filters,
                        },
                        collapsibles: {
                            ...DEFAULT_PREFERENCES.collapsibles,
                            // Support old localStorage with top-level collapsibles
                            ...persisted?.collapsibles,
                            ...persisted?.preferences?.collapsibles,
                        },
                    },
                };
            },
        },
    ),
);
