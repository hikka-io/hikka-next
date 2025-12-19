'use client';

import {
    HSLColor,
    UIColorTokens,
    UIEffect,
    UIPreferences,
    UIStyles,
    UIThemeStyles,
    UserAppearance,
} from '@hikka/client';
import { type StoreApi, createStore } from 'zustand/vanilla';

import {
    DEFAULT_APPEARANCE,
    mergeEffects,
    mergeStyles,
} from '@/utils/appearance';
import { getSessionUserUI, updateUserUI } from '@/utils/appearance/server';
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
    setBody: (
        theme: 'light' | 'dark',
        body: UIThemeStyles['body'] | undefined,
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
    updateUserUI: () => Promise<UserAppearance>;
    syncUserUI: () => Promise<UserAppearance>;

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
            get().updateUserUI();
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
            get().updateUserUI();
        },

        // Styles
        setStyles: (styles) => {
            set((state) => ({
                ...state,
                styles,
            }));
        },

        setBody: (theme, body) => {
            set((state) => ({
                ...state,
                styles: {
                    ...state.styles,
                    [theme]: { ...state.styles?.[theme], body },
                },
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
            get().updateUserUI();
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
            get().updateUserUI();
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
        updateUserUI: async () => {
            const state = get();
            const appearance: Omit<UserAppearance, 'username'> = {
                styles: state.styles,
                preferences: state.preferences,
            };

            const result = await updateUserUI(appearance);

            return result;
        },

        syncUserUI: async () => {
            const userUI = await getSessionUserUI();

            set({
                ...userUI,
                _hasHydrated: true,
            });

            return userUI;
        },
    }));
}
