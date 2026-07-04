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

/** Merge layer guarantees `feed`/`widgets` are present; required here though the API marks them optional. */
type SessionFeedSettings = UiFeedSettingsOutput & {
    widgets: UiFeedWidget[];
};

/** Narrows the API-widened `title_language`/`name_language` strings to their app unions. */
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
    // @hikka/api client is configured globally, so this works even inside Providers.
    // API response is a structural superset of UserUI, so cast at this boundary.
    const { data } = useQuery({
        ...profileUiOptions(),
    });
    const userUI =
        (data as UserCustomizationResponse | undefined) ?? DEFAULT_USER_UI;

    return useMemo(() => {
        // Merge sparse API styles with defaults so UI always has full tokens.
        const resolvedStyles = mergeStyles(
            DEFAULT_USER_UI.styles,
            userUI.styles,
        );
        // Layer defaults < event theme < user's sparse styles (matches SSR in
        // utils/ui/server.ts): event theme applies only where the user hasn't
        // customized. Merging it under the densified resolvedStyles would mask it.
        const eventTheme = getActiveEventTheme();
        const mergedStyles = mergeStyles(
            mergeStyles(DEFAULT_USER_UI.styles, eventTheme?.styles),
            userUI.styles,
        );
        const activeEffects = mergeEffects(
            eventTheme?.effects,
            userUI.preferences?.effect,
        );
        return {
            // Merge against defaults so `feed`/`widgets` are always present (API
            // marks them optional); narrow widened language literals here (see SessionPreferences).
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
