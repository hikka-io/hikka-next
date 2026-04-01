import {
    HSLColor,
    UIColorTokens,
    UIStyles,
    UIThemeStyles,
} from '@hikka/client';
import { type TemporalState, temporal } from 'zundo';
import { type StoreApi, createStore } from 'zustand/vanilla';

import { getActiveEventTheme } from '@/utils/constants/event-themes';
import { DEFAULT_STYLES, mergeStyles } from '@/utils/ui';

export type StylesEditorState = {
    styles: UIStyles;
};

export type StylesEditorTemporalState = TemporalState<StylesEditorState>;

export interface StylesEditorActions {
    setColorToken: (
        theme: 'light' | 'dark',
        token: keyof UIColorTokens,
        value: HSLColor | undefined,
    ) => void;
    setThemeColors: (
        theme: 'light' | 'dark',
        colors: Partial<UIColorTokens>,
    ) => void;
    setBody: (
        theme: 'light' | 'dark',
        body: UIThemeStyles['body'] | undefined,
    ) => void;
    setStyles: (styles: UIStyles | undefined) => void;
    getMergedStyles: () => UIStyles;
}

export type StylesEditorStore = StylesEditorState & StylesEditorActions;

export type StylesEditorStoreWithTemporal = StoreApi<StylesEditorStore> & {
    temporal: StoreApi<StylesEditorTemporalState>;
};

export function createStylesEditorStore(
    initialStyles: UIStyles,
): StylesEditorStoreWithTemporal {
    // Ensure all default tokens are present even if initialStyles is sparse
    const resolved = mergeStyles(DEFAULT_STYLES, initialStyles);

    return createStore<StylesEditorStore>()(
        temporal(
            (set, get) => ({
                styles: resolved,

                setColorToken: (theme, token, value) => {
                    set((state) => ({
                        styles: {
                            ...state.styles,
                            [theme]: {
                                ...state.styles?.[theme],
                                colors: {
                                    ...state.styles?.[theme]?.colors,
                                    [token]: value,
                                },
                            },
                        },
                    }));
                },

                setThemeColors: (theme, colors) => {
                    set((state) => ({
                        styles: {
                            ...state.styles,
                            [theme]: {
                                ...state.styles?.[theme],
                                colors: {
                                    ...state.styles?.[theme]?.colors,
                                    ...colors,
                                },
                            },
                        },
                    }));
                },

                setBody: (theme, body) => {
                    set((state) => ({
                        styles: {
                            ...state.styles,
                            [theme]: { ...state.styles?.[theme], body },
                        },
                    }));
                },

                setStyles: (styles) => {
                    set({ styles: styles ?? {} });
                },

                getMergedStyles: () => {
                    const eventTheme = getActiveEventTheme();
                    const withDefaults = mergeStyles(
                        DEFAULT_STYLES,
                        get().styles,
                    );
                    return mergeStyles(eventTheme?.styles, withDefaults);
                },
            }),
            {
                partialize: (state) => ({ styles: state.styles }),
                limit: 20,
                equality: (pastState, currentState) =>
                    JSON.stringify(pastState) === JSON.stringify(currentState),
            },
        ),
    ) as StylesEditorStoreWithTemporal;
}
