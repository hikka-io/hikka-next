import { type TemporalState, temporal } from 'zundo';
import { createStore, type StoreApi } from 'zustand/vanilla';

import type {
    HslColor,
    UiColorTokens,
    UiStylesOutput,
    UiThemeStylesOutput,
} from '@hikka/api';

import { getActiveEventTheme } from '@/utils/constants/event-themes';
import { DEFAULT_STYLES, mergeStyles } from '@/utils/ui';

export type StylesEditorState = {
    styles: UiStylesOutput;
};

export type StylesEditorTemporalState = TemporalState<StylesEditorState>;

export interface StylesEditorActions {
    setColorToken: (
        theme: 'light' | 'dark',
        token: keyof UiColorTokens,
        value: HslColor | undefined,
    ) => void;
    setThemeColors: (
        theme: 'light' | 'dark',
        colors: Partial<UiColorTokens>,
    ) => void;
    setBody: (
        theme: 'light' | 'dark',
        body: UiThemeStylesOutput['body'] | undefined,
    ) => void;
    setStyles: (styles: UiStylesOutput | undefined) => void;
    getMergedStyles: () => UiStylesOutput;
}

export type StylesEditorStore = StylesEditorState & StylesEditorActions;

export type StylesEditorStoreWithTemporal = StoreApi<StylesEditorStore> & {
    temporal: StoreApi<StylesEditorTemporalState>;
};

export function createStylesEditorStore(
    initialStyles: UiStylesOutput,
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
