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
}

export interface SettingsActions {
    setTitleLanguage: (titleLanguage: SettingsState['titleLanguage']) => void;
    setNameLanguage: (nameLanguage: SettingsState['nameLanguage']) => void;
    setEditTags: (editTags: string[]) => void;
    setSnowflakes: (snowflakes: boolean) => void;
    setFilterPresets: (filterPresets: Hikka.FilterPreset[]) => void;
    reset: () => void;
}

const DEFAULT_SETTINGS: SettingsState = {
    titleLanguage: 'title_ua',
    nameLanguage: 'name_ua',
    editTags: ['Додано назву', 'Додано синоніми', 'Додано опис', 'Додано імʼя'],
    snowflakes: false,
    filterPresets: [],
};

export type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,

            setTitleLanguage: (titleLanguage) => set({ titleLanguage }),
            setNameLanguage: (nameLanguage) => set({ nameLanguage }),
            setEditTags: (editTags) => set({ editTags }),
            setSnowflakes: (snowflakes) => set({ snowflakes }),
            setFilterPresets: (filterPresets) => set({ filterPresets }),
            reset: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: 'settings', // localStorage key
        },
    ),
);
