import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import {
    profileUiOptions,
    type UiFeedSettingsOutput,
    type UiFeedWidget,
} from '@hikka/api';
import {
    DEFAULT_USER_UI,
    type NameLanguage,
    type TitleLanguage,
} from '@hikka/core';

import { useSession } from '@/features/auth';

type HomePreferences = {
    titleLanguage: TitleLanguage;
    nameLanguage: NameLanguage;
    feed: UiFeedSettingsOutput;
    widgets: Set<UiFeedWidget['slug']>;
};

const DEFAULTS = DEFAULT_USER_UI.preferences;

export function useHomePreferences(): HomePreferences {
    const { user } = useSession();
    const { data } = useQuery({ ...profileUiOptions(), enabled: !!user });
    const saved = user ? data?.preferences : undefined;

    return useMemo(() => {
        const feed = { ...DEFAULTS.feed, ...saved?.feed };

        return {
            titleLanguage: (saved?.title_language ??
                DEFAULTS.title_language) as TitleLanguage,
            nameLanguage: (saved?.name_language ??
                DEFAULTS.name_language) as NameLanguage,
            feed,
            widgets: new Set(feed.widgets?.map((widget) => widget.slug)),
        };
    }, [saved]);
}
