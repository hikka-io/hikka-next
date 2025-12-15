'use client';

import {
    HSLColor,
    UIColorTokens,
    UIEffect,
    UIPreferences,
    UIStyles,
    UserAppearance,
} from '@hikka/client';
import { type StoreApi, createStore } from 'zustand/vanilla';

import {
    DEFAULT_APPEARANCE,
    mergeEffects,
    mergeStyles,
} from '@/utils/appearance';
import { getActiveEventTheme } from '@/utils/constants/event-themes';

export type UIState = UserAppearance & {
    _hasHydrated: boolean;
};

export interface UIActions {
    setHasHydrated: (hasHydrated: boolean) => void;

    // Preferences
    setTitleLanguage: (title_language: UIPreferences['title_language']) => void;
    setNameLanguage: (name_language: UIPreferences['name_language']) => void;

    // Styles
    setStyles: (styles: UIStyles | undefined) => void;
    setColorToken: (
        theme: 'light' | 'dark',
        token: keyof UIColorTokens,
        value: HSLColor | undefined,
    ) => void;
    setRadius: (radius: string | undefined) => void;

    // Effects
    toggleEffect: (effect: UIEffect) => void;
    setEffects: (effects: UIEffect[]) => void;

    // Full replace
    setAppearance: (appearance: UserAppearance) => void;

    // Computed getters
    getMergedStyles: () => UIStyles;
    getActiveEffects: () => UIEffect[];

    // Backend API
    syncChanges: () => Promise<UserAppearance | null>;

    // Reset
    reset: () => void;
}

export type UIStore = UIState & UIActions;

function normalizeInitialAppearance(
    initial: UserAppearance | undefined,
): UserAppearance {
    return {
        styles: mergeStyles(DEFAULT_APPEARANCE.styles, initial?.styles),
        preferences: {
            ...(DEFAULT_APPEARANCE.preferences ?? {}),
            ...(initial?.preferences ?? {}),
        },
    };
}

export function createUIStore(
    initialAppearance?: UserAppearance,
): StoreApi<UIStore> {
    const normalized = normalizeInitialAppearance(initialAppearance);

    return createStore<UIStore>()((set, get) => ({
        ...DEFAULT_APPEARANCE,
        ...normalized,
        _hasHydrated: true,

        setHasHydrated: (hasHydrated) => {
            set({ _hasHydrated: hasHydrated });
        },

        setAppearance: (appearance) => {
            const next = normalizeInitialAppearance(appearance);
            set((state) => ({
                ...state,
                ...next,
            }));
        },

        // Preferences
        setTitleLanguage: (title_language) => {
            set((state) => ({
                ...state,
                preferences: {
                    ...(state.preferences ??
                        DEFAULT_APPEARANCE.preferences ??
                        {}),
                    title_language,
                },
            }));
        },

        setNameLanguage: (name_language) => {
            set((state) => ({
                ...state,
                preferences: {
                    ...(state.preferences ??
                        DEFAULT_APPEARANCE.preferences ??
                        {}),
                    name_language,
                },
            }));
        },

        // Styles
        setStyles: (styles) => {
            set((state) => ({
                ...state,
                styles,
            }));
        },

        setColorToken: (theme, token, value) => {
            set((state) => {
                const currentStyles = state.styles ?? {};
                const currentThemeColors = currentStyles[theme]?.colors ?? {};

                return {
                    ...state,
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
                };
            });
        },

        setRadius: (radius) => {
            set((state) => ({
                ...state,
                styles: {
                    ...state.styles,
                    radius,
                },
            }));
        },

        // Effects
        toggleEffect: (effect) => {
            set((state) => {
                const currentEffects = state.preferences?.effects ?? [];
                const hasEffect = currentEffects.includes(effect);
                const effects = hasEffect
                    ? currentEffects.filter((e) => e !== effect)
                    : [...currentEffects, effect];

                return {
                    ...state,
                    preferences: {
                        ...(state.preferences ??
                            DEFAULT_APPEARANCE.preferences ??
                            {}),
                        effects,
                    },
                };
            });
        },

        setEffects: (effects) => {
            set((state) => ({
                ...state,
                preferences: {
                    ...(state.preferences ??
                        DEFAULT_APPEARANCE.preferences ??
                        {}),
                    effects,
                },
            }));
        },

        // Computed getters
        getMergedStyles: () => {
            const state = get();
            const eventTheme = getActiveEventTheme();

            return mergeStyles(eventTheme?.styles, state.styles);
        },

        getActiveEffects: () => {
            const state = get();
            const eventTheme = getActiveEventTheme();

            return mergeEffects(
                eventTheme?.effects,
                state.preferences?.effects,
            );
        },

        // Reset
        reset: () => {
            set({
                ...DEFAULT_APPEARANCE,
                _hasHydrated: true,
            });
        },

        // Backend API
        syncChanges: async () => {
            return Promise.resolve(null);
        },
    }));
}
