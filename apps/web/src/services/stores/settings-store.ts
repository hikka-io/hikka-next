'use client';

import { NameLanguage, TitleLanguage } from '@hikka/react/utils';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SettingsState {
    titleLanguage: TitleLanguage;
    nameLanguage: NameLanguage;
    editTags: string[];
    snowflakes: boolean;
}

export interface SettingsActions {
    setTitleLanguage: (titleLanguage: SettingsState['titleLanguage']) => void;
    setNameLanguage: (nameLanguage: SettingsState['nameLanguage']) => void;
    setEditTags: (editTags: string[]) => void;
    setSnowflakes: (snowflakes: boolean) => void;
    reset: () => void;
}

const DEFAULT_SETTINGS: SettingsState = {
    titleLanguage: 'title_ua',
    nameLanguage: 'name_ua',
    editTags: ['Додано назву', 'Додано синоніми', 'Додано опис', 'Додано імʼя'],
    snowflakes: false,
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
            reset: () => set(DEFAULT_SETTINGS),
        }),
        {
            name: 'settings', // localStorage key
        },
    ),
);
