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
import { type TemporalState, temporal } from 'zundo';
import { type StoreApi, createStore } from 'zustand/vanilla';

import {
    DEFAULT_APPEARANCE,
    mergeEffects,
    mergeStyles,
} from '@/utils/appearance';
import { getSessionUserUI, updateUserUI } from '@/utils/appearance/server';
import { getActiveEventTheme } from '@/utils/constants/event-themes';

export type PartializedUIState = Pick<UIState, 'styles'>;

export type UITemporalState = TemporalState<PartializedUIState>;

export type UIState = UserAppearance & {
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

    setUI: (UI: UserAppearance) => void;

    getMergedStyles: () => UIStyles;
    getActiveEffects: () => UIEffect[];

    // Backend API
    updateUserUI: () => Promise<UserAppearance>;
    syncUserUI: () => Promise<UserAppearance>;

    reset: () => void;
}

export type UIStore = UIState & UIActions;

function normalizeInitialUI(
    initialUI: UserAppearance | undefined,
): UserAppearance {
    return {
        styles: mergeStyles(DEFAULT_APPEARANCE.styles, initialUI?.styles),
        preferences: {
            ...(DEFAULT_APPEARANCE.preferences ?? {}),
            ...(initialUI?.preferences ?? {}),
        },
    };
}

export type UIStoreWithTemporal = StoreApi<UIStore> & {
    temporal: StoreApi<UITemporalState>;
};

export function createUIStore(initialUI?: UserAppearance): UIStoreWithTemporal {
    const normalized = normalizeInitialUI(initialUI);

    return createStore<UIStore>()(
        temporal(
            (set, get) => ({
                ...DEFAULT_APPEARANCE,
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

                setOverlay: (overlay) => {
                    set((state) => ({
                        ...state,
                        preferences: {
                            ...(state.preferences ??
                                DEFAULT_APPEARANCE.preferences ??
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
