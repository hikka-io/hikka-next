import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    profileUiOptions,
    type UiFeedSettingsOutput,
    type UiFeedWidget,
    type UiStylesOutput,
    type UserCustomizationResponse,
} from '@hikka/api';

import {
    DEFAULT_USER_UI,
    getActiveEventTheme,
    mergeEffects,
    mergePreferences,
    mergeStyles,
    mergeUserStyles,
    type ResolvedBackdrop,
    resolveBackdrop,
    type UIEffect,
} from '@/utils/customization';
import type { NameLanguage, TitleLanguage } from '@/utils/title/get-title';

import { useSession } from './use-session';

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
    const { user } = useSession();
    // @hikka/api client is configured globally, so this works even inside Providers.
    // API response is a structural superset of UserUI, so cast at this boundary.
    const { data } = useQuery({
        ...profileUiOptions(),
        enabled: !!user,
    });
    const userUI =
        (data as UserCustomizationResponse | undefined) ?? DEFAULT_USER_UI;

    return useMemo(() => {
        // Merge sparse API styles with defaults so UI always has full tokens.
        const resolvedStyles = mergeStyles(
            DEFAULT_USER_UI.styles,
            userUI.styles,
        );
        const eventTheme = getActiveEventTheme();
        // Sparse styles on purpose: resolvedStyles would mask the event theme.
        const mergedStyles = mergeUserStyles(
            DEFAULT_USER_UI.styles,
            eventTheme,
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
