import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { profileUiOptions } from '@hikka/api';
import {
    DEFAULT_USER_UI,
    getTitle,
    type NameLanguage,
    type TitleLanguage,
} from '@hikka/core';

import { useAuthToken } from '@/features/auth';

const DEFAULTS = DEFAULT_USER_UI.preferences;

/**
 * The one way to show a title or a name: `getTitle` bound to the viewer's title and name
 * language. Every cell calls it, so it subscribes to a small selection, not the whole document.
 */
export function useTitle() {
    const hasToken = !!useAuthToken();
    const { data } = useQuery({
        ...profileUiOptions(),
        enabled: hasToken,
        select: (ui) => ({
            title: (ui.preferences?.title_language ??
                DEFAULTS.title_language) as TitleLanguage,
            name: (ui.preferences?.name_language ??
                DEFAULTS.name_language) as NameLanguage,
        }),
    });
    const title = data?.title ?? (DEFAULTS.title_language as TitleLanguage);
    const name = data?.name ?? (DEFAULTS.name_language as NameLanguage);

    return useCallback(
        (item: Record<string, unknown> | object | null | undefined) =>
            getTitle(item, title, name),
        [title, name],
    );
}
