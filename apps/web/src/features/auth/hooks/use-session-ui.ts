import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    profileUiOptions,
    type UiFeedSettingsOutput,
    type UiFeedWidget,
    type UiPreferencesOutput,
    type UiStylesOutput,
    type UserCustomizationResponse,
} from '@hikka/api';

import { getActiveEventTheme } from '@/utils/constants/event-themes';
import type { NameLanguage, TitleLanguage } from '@/utils/title/get-title';
import {
    DEFAULT_USER_UI,
    mergeEffects,
    mergePreferences,
    mergeStyles,
    type ResolvedBackdrop,
    resolveBackdrop,
} from '@/utils/ui';

type UIEffect = NonNullable<UiPreferencesOutput['effect']>;

/**
 * The merge layer (mergePreferences/DEFAULT_USER_UI) guarantees `feed` and its
 * `widgets` are always present, so they are required here even though the
 * generated `UiFeedSettingsOutput` marks them optional.
 */
type SessionFeedSettings = UiFeedSettingsOutput & {
    widgets: UiFeedWidget[];
};

/**
 * The generated `title_language`/`name_language` are widened to `string`, but
 * the app consumes them as its `TitleLanguage`/`NameLanguage` unions (the
 * backend only ever returns those literals). Narrow at this single boundary,
 * and surface the always-present `feed` settings.
 */
type SessionPreferences = Omit<
    NonNullable<UserCustomizationResponse['preferences']>,
    'title_language' | 'name_language' | 'feed'
> & {
    title_language?: TitleLanguage;
    name_language?: NameLanguage;
    feed: SessionFeedSettings;
};

interface SessionUI {
    preferences: SessionPreferences;
    styles: UiStylesOutput;
    mergedStyles: UiStylesOutput;
    backdrop: ResolvedBackdrop;
    activeEffects: UIEffect[];
}

export function useSessionUI(): SessionUI {
    // The generated @hikka/api client is configured globally (not via React
    // context), so the query options work even though this hook runs in
    // Providers. The API response is a structural superset of the app-owned
    // UserUI type, so we cast at this boundary.
    const { data } = useQuery({
        ...profileUiOptions(),
    });
    const userUI =
        (data as UserCustomizationResponse | undefined) ?? DEFAULT_USER_UI;

    return useMemo(() => {
        // Merge sparse API styles with defaults so editors/UI always have full
        // tokens.
        const resolvedStyles = mergeStyles(
            DEFAULT_USER_UI.styles,
            userUI.styles,
        );
        // Then layer event theme on top of resolved styles (single merge, not two)
        const eventTheme = getActiveEventTheme();
        const mergedStyles = mergeStyles(eventTheme?.styles, resolvedStyles);
        const activeEffects = mergeEffects(
            eventTheme?.effects,
            userUI.preferences?.effect,
        );
        return {
            // Merge against defaults so `feed`/`widgets` are always present
            // (the API marks them optional), then narrow the widened language
            // literals at this boundary (see SessionPreferences above).
            preferences: mergePreferences(
                DEFAULT_USER_UI.preferences,
                userUI.preferences,
            ) as SessionPreferences,
            styles: resolvedStyles,
            mergedStyles,
            backdrop: resolveBackdrop(mergedStyles),
            activeEffects,
        };
    }, [userUI]);
}
