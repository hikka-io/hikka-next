'use client';

import { NameLanguage, TitleLanguage } from '@hikka/react/utils';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
    titleLanguage: TitleLanguage;
    nameLanguage: NameLanguage;
    editTags: string[];
    snowflakes: boolean;
    filterPresets: Hikka.FilterPreset[];
    collapsibles: Record<string, boolean>;
    _hasHydrated: boolean;
}

export interface SettingsActions {
    setHasHydrated: (hasHydrated: boolean) => void;
    setTitleLanguage: (titleLanguage: SettingsState['titleLanguage']) => void;
    setNameLanguage: (nameLanguage: SettingsState['nameLanguage']) => void;
    setEditTags: (editTags: string[]) => void;
    setSnowflakes: (snowflakes: boolean) => void;
    setFilterPresets: (filterPresets: Hikka.FilterPreset[]) => void;
    setCollapsibles: (collapsibles: Record<string, boolean>) => void;
    reset: () => void;
}

const DEFAULT_SETTINGS: SettingsState = {
    titleLanguage: 'title_ua',
    nameLanguage: 'name_ua',
    editTags: ['Додано назву', 'Додано синоніми', 'Додано опис', 'Додано імʼя'],
    snowflakes: false,
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
            _hasHydrated: false,
            setHasHydrated: (state) => {
                set({
                    _hasHydrated: state,
                });
            },
            setTitleLanguage: (titleLanguage) => set({ titleLanguage }),
            setNameLanguage: (nameLanguage) => set({ nameLanguage }),
            setEditTags: (editTags) => set({ editTags }),
            setSnowflakes: (snowflakes) => set({ snowflakes }),
            setFilterPresets: (filterPresets) => set({ filterPresets }),
            setCollapsibles: (collapsibles) => set({ collapsibles }),
            reset: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: 'settings', // localStorage key
            onRehydrateStorage: (state) => {
                return () => state.setHasHydrated(true);
            },
        },
    ),
);
