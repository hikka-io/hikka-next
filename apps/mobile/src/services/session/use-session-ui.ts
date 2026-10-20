import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { profileUiOptions, type UiStylesOutput } from '@hikka/api';
import {
    DEFAULT_USER_UI,
    mergePreferences,
    mergeStyles,
    type NameLanguage,
    type TitleLanguage,
} from '@hikka/core';

import { useAuthToken } from '@/features/auth';

type SessionUI = {
    titleLanguage: TitleLanguage;
    nameLanguage: NameLanguage;
    showNsfw: boolean;
    styles: UiStylesOutput;
    isPending: boolean;
    error: unknown;
    refetch: () => void;
};

const DEFAULTS = DEFAULT_USER_UI.preferences;

/**
 * The viewer's saved UI customization, merged over the defaults. While it loads or after it
 * failed the values are the defaults: a screen that writes preferences must check `isPending`
 * and `error` first, because the write replaces the whole document.
 */
export function useSessionUI(): SessionUI {
    const hasToken = !!useAuthToken();
    const { data, isPending, error, refetch } = useQuery({
        ...profileUiOptions(),
        enabled: hasToken,
    });

    return useMemo(() => {
        const preferences = mergePreferences(DEFAULTS, data?.preferences);

        return {
            titleLanguage: (preferences.title_language ??
                DEFAULTS.title_language) as TitleLanguage,
            nameLanguage: (preferences.name_language ??
                DEFAULTS.name_language) as NameLanguage,
            showNsfw: preferences.show_nsfw ?? false,
            styles: mergeStyles(DEFAULT_USER_UI.styles, data?.styles),
            isPending: hasToken && isPending,
            error,
            refetch: () => void refetch(),
        };
    }, [data, hasToken, isPending, error, refetch]);
}
