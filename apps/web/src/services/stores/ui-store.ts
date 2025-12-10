'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
    DEFAULT_APPEARANCE,
    mergeEffects,
    mergeStyles,
} from '@/utils/appearance';
import { getActiveEventTheme } from '@/utils/constants/event-themes';
import { cookieStorage } from '@/utils/ui-cookies';

export interface UIState {
    appearance: Hikka.UserAppearance;
    _hasHydrated: boolean;
}

export interface UIActions {
    setHasHydrated: (hasHydrated: boolean) => void;

    // Preferences
    setTitleLanguage: (
        titleLanguage: Hikka.UIPreferences['titleLanguage'],
    ) => void;
    setNameLanguage: (
        nameLanguage: Hikka.UIPreferences['nameLanguage'],
    ) => void;

    // Styles
    setStyles: (styles: Hikka.UIStyles | undefined) => void;
    setColorToken: (
        theme: 'light' | 'dark',
        token: keyof Hikka.UIColorTokens,
        value: Hikka.HSLColor | undefined,
    ) => void;
    setRadius: (radius: string | undefined) => void;

    // Effects
    toggleEffect: (effect: Hikka.UIEffect) => void;
    setEffects: (effects: Hikka.UIEffect[]) => void;

    // Computed getters
    getMergedStyles: () => Hikka.UIStyles;
    getActiveEffects: () => Hikka.UIEffect[];

    // TODO: Implement when backend is ready
    loadFromRemote: () => Promise<void>;
    saveToRemote: () => Promise<void>;

    // Reset
    reset: () => void;
}

export type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
    persist(
        (set, get) => ({
            appearance: DEFAULT_APPEARANCE,
            _hasHydrated: false,

            setHasHydrated: (hasHydrated) => {
                set({ _hasHydrated: hasHydrated });
            },

            // Preferences
            setTitleLanguage: (titleLanguage) => {
                set((state) => {
                    const currentPreferences =
                        state.appearance.preferences ??
                        DEFAULT_APPEARANCE.preferences!;
                    return {
                        appearance: {
                            ...state.appearance,
                            preferences: {
                                ...currentPreferences,
                                titleLanguage,
                            },
                        },
                    };
                });
            },

            setNameLanguage: (nameLanguage) => {
                set((state) => {
                    const currentPreferences =
                        state.appearance.preferences ??
                        DEFAULT_APPEARANCE.preferences!;
                    return {
                        appearance: {
                            ...state.appearance,
                            preferences: {
                                ...currentPreferences,
                                nameLanguage,
                            },
                        },
                    };
                });
            },

            // Styles
            setStyles: (styles) => {
                set((state) => ({
                    appearance: {
                        ...state.appearance,
                        styles,
                    },
                }));
            },

            setColorToken: (theme, token, value) => {
                set((state) => {
                    const currentStyles = state.appearance.styles ?? {};
                    const currentThemeColors =
                        currentStyles[theme]?.colors ?? {};

                    return {
                        appearance: {
                            ...state.appearance,
                            styles: {
                                ...currentStyles,
                                [theme]: {
                                    ...currentStyles[theme],
                                    colors: {
                                        ...currentThemeColors,
                                        [token]: value,
                                    },
                                },
                            },
                        },
                    };
                });
            },

            setRadius: (radius) => {
                set((state) => ({
                    appearance: {
                        ...state.appearance,
                        styles: {
                            ...state.appearance.styles,
                            radius,
                        },
                    },
                }));
            },

            // Effects
            toggleEffect: (effect) => {
                set((state) => {
                    const currentEffects = state.appearance.effects ?? [];
                    const hasEffect = currentEffects.includes(effect);

                    return {
                        appearance: {
                            ...state.appearance,
                            effects: hasEffect
                                ? currentEffects.filter((e) => e !== effect)
                                : [...currentEffects, effect],
                        },
                    };
                });
            },

            setEffects: (effects) => {
                set((state) => ({
                    appearance: {
                        ...state.appearance,
                        effects,
                    },
                }));
            },

            getMergedStyles: () => {
                const state = get();
                const eventTheme = getActiveEventTheme();

                return mergeStyles(eventTheme?.styles, state.appearance.styles);
            },

            getActiveEffects: () => {
                const state = get();
                const eventTheme = getActiveEventTheme();

                return mergeEffects(
                    eventTheme?.effects,
                    state.appearance.effects,
                );
            },

            loadFromRemote: async () => {
                // TODO: Implement when backend is ready
                // 1. Fetch user appearance from API
                // 2. Compare version with local
                // 3. Update if remote is newer
            },

            saveToRemote: async () => {
                // TODO: Implement when backend is ready
                // 1. Send current appearance to API
                // 2. Update version on success
            },

            reset: () => {
                set({
                    appearance: DEFAULT_APPEARANCE,
                });
            },
        }),
        {
            name: 'ui-appearance',
            storage: cookieStorage,
            onRehydrateStorage: (state) => {
                return () => state.setHasHydrated(true);
            },
        },
    ),
);
