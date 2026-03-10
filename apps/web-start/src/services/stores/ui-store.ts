'use client';

import {
    HSLColor,
    UIColorTokens,
    UIEffect,
    UIPreferences,
    UIStyles,
    UIThemeStyles,
    UserUI,
} from '@hikka/client';
import { type TemporalState, temporal } from 'zundo';
import { type StoreApi, createStore } from 'zustand/vanilla';

import { getActiveEventTheme } from '@/utils/constants/event-themes';
import { DEFAULT_USER_UI, mergeEffects, mergeStyles } from '@/utils/ui';
import { getSessionUserUI, updateUserUI } from '@/utils/ui/server';

export type PartializedUIState = Pick<UIState, 'styles'>;

export type UITemporalState = TemporalState<PartializedUIState>;

export type UIState = UserUI & {
    _hasHydrated: boolean;
};

export interface UIActions {
    setHasHydrated: (hasHydrated: boolean) => void;

    // Preferences
    setTitleLanguage: (title_language: UIPreferences['title_language']) => void;
    setNameLanguage: (name_language: UIPreferences['name_language']) => void;
    setOverlay: (overlay: UIPreferences['overlay']) => void;

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

    setUI: (UI: UserUI) => void;

    getMergedStyles: () => UIStyles;
    getActiveEffects: () => UIEffect[];

    // Backend API
    updateUserUI: () => Promise<UserUI>;
    syncUserUI: () => Promise<UserUI>;

    reset: () => void;
}

export type UIStore = UIState & UIActions;

function normalizeInitialUI(initialUI: UserUI | undefined): UserUI {
    return {
        styles: mergeStyles(DEFAULT_USER_UI.styles, initialUI?.styles),
        preferences: {
            ...(DEFAULT_USER_UI.preferences ?? {}),
            ...(initialUI?.preferences ?? {}),
        },
    };
}

export type UIStoreWithTemporal = StoreApi<UIStore> & {
    temporal: StoreApi<UITemporalState>;
};

export function createUIStore(initialUI?: UserUI): UIStoreWithTemporal {
    const normalized = normalizeInitialUI(initialUI);

    return createStore<UIStore>()(
        temporal(
            (set, get) => ({
                ...DEFAULT_USER_UI,
                ...normalized,
                _hasHydrated: true,

                setHasHydrated: (hasHydrated) => {
                    set({ _hasHydrated: hasHydrated });
                },

                setUI: (UI) => {
                    const next = normalizeInitialUI(UI);
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
                                DEFAULT_USER_UI.preferences ??
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
                                DEFAULT_USER_UI.preferences ??
                                {}),
                            name_language,
                        },
                    }));
                    get().updateUserUI();
                },

                setOverlay: (overlay) => {
                    set((state) => ({
                        ...state,
                        preferences: {
                            ...(state.preferences ??
                                DEFAULT_USER_UI.preferences ??
                                {}),
                            overlay,
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
                        const currentThemeColors =
                            currentStyles[theme]?.colors ?? {};

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
                                    DEFAULT_USER_UI.preferences ??
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
                                DEFAULT_USER_UI.preferences ??
                                {}),
                            effects,
                        },
                    }));
                },

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
                        ...DEFAULT_USER_UI,
                        _hasHydrated: true,
                    });
                },

                // Backend API
                updateUserUI: async () => {
                    const state = get();
                    const userUI: Omit<UserUI, 'username'> = {
                        styles: state.styles,
                        preferences: state.preferences,
                    };

                    const result = await updateUserUI(userUI);

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
            }),
            {
                partialize: (state) => ({
                    styles: state.styles,
                }),

                limit: 20,
                equality: (pastState, currentState) =>
                    JSON.stringify(pastState) === JSON.stringify(currentState),
            },
        ),
    ) as UIStoreWithTemporal;
}
