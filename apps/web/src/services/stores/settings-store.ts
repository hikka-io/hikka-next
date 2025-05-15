'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
    titleLanguage: 'title_en' | 'title_ua' | 'title_ja';
    editTags: string[];
    snowflakes: boolean;
}

export interface SettingsActions {
    setTitleLanguage: (titleLanguage: SettingsState['titleLanguage']) => void;
    setEditTags: (editTags: string[]) => void;
    setSnowflakes: (snowflakes: boolean) => void;
    reset: () => void;
}

const DEFAULT_SETTINGS: SettingsState = {
    titleLanguage: 'title_ua',
    editTags: ['Додано назву', 'Додано синоніми', 'Додано опис', 'Додано імʼя'],
    snowflakes: false,
};

export type SettingsStore = SettingsState & SettingsActions;

export const useSettingsStore = create<SettingsStore>()(
    persist(
        (set) => ({
            ...DEFAULT_SETTINGS,

            setTitleLanguage: (titleLanguage) => set({ titleLanguage }),
            setEditTags: (editTags) => set({ editTags }),
            setSnowflakes: (snowflakes) => set({ snowflakes }),
            reset: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: 'settings', // localStorage key
        },
    ),
);
