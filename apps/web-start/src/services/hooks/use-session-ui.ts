'use client';

import { UIEffect, UIStyles, UserUI } from '@hikka/client';
import { sessionUserUIOptions } from '@hikka/react/options';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

import { DEFAULT_USER_UI, mergeWithEventTheme } from '@/utils/ui';

const rootRoute = getRouteApi('__root__');

interface SessionUI {
    preferences: NonNullable<UserUI['preferences']>;
    styles: UIStyles;
    mergedStyles: UIStyles;
    activeEffects: UIEffect[];
}

export function useSessionUI(): SessionUI {
    // Use useQuery directly (not useSessionUserUI from @hikka/react)
    // because this hook is called in Providers — OUTSIDE HikkaContextProvider.
    // Get the hikkaClient from router context to provide queryFn.
    const { hikkaClient } = rootRoute.useRouteContext() as {
        hikkaClient: import('@hikka/client').HikkaClient;
    };
    const { data } = useQuery({
        ...sessionUserUIOptions(hikkaClient),
    });
    const userUI = data ?? DEFAULT_USER_UI;

    return useMemo(() => {
        const { mergedStyles, activeEffects } = mergeWithEventTheme(userUI);
        return {
            preferences: userUI.preferences ?? DEFAULT_USER_UI.preferences!,
            styles: userUI.styles ?? DEFAULT_USER_UI.styles!,
            mergedStyles,
            activeEffects,
        };
    }, [userUI]);
}
