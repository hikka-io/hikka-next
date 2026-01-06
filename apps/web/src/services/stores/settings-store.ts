'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SecondaryTitleLang = 'romaji' | 'en' | 'ja' | 'ua';

export interface SettingsState {
    editTags: string[];
    filterPresets: Hikka.FilterPreset[];
    collapsibles: Record<string, boolean>;
    secondaryTitleLanguage: SecondaryTitleLang;
    _hasHydrated: boolean;
}

export interface SettingsActions {
    setHasHydrated: (hasHydrated: boolean) => void;
    setEditTags: (editTags: string[]) => void;
    setFilterPresets: (filterPresets: Hikka.FilterPreset[]) => void;
    setCollapsibles: (collapsibles: Record<string, boolean>) => void;
    setSecondaryTitleLanguage: (lang: SecondaryTitleLang) => void;
    reset: () => void;
}

const DEFAULT_SETTINGS: SettingsState = {
    _hasHydrated: false,
    editTags: ['Додано назву', 'Додано синоніми', 'Додано опис', 'Додано імʼя'],
    secondaryTitleLanguage: 'romaji',
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
    collapsibles: {
        content_score: true,
        content_progress: true,
    },
};

export type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            setEditTags: (editTags) => set({ editTags }),
            setFilterPresets: (filterPresets) => set({ filterPresets }),
            setCollapsibles: (collapsibles) => set({ collapsibles }),
            setSecondaryTitleLanguage: (lang) => set({ secondaryTitleLanguage: lang }),
            reset: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: 'settings',
            onRehydrateStorage: (state) => () => state?.setHasHydrated(true),
        },
    ),
);
