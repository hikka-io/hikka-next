'use client';

import { UIEffect, UIStyles, UserUI } from '@hikka/client';
import { sessionUserUIOptions } from '@hikka/react/options';
import { useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

import { getActiveEventTheme } from '@/utils/constants/event-themes';
import { DEFAULT_USER_UI, mergeEffects, mergeStyles } from '@/utils/ui';

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
        // Merge sparse API styles with defaults so editors/UI always have full tokens
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
            preferences: userUI.preferences ?? DEFAULT_USER_UI.preferences!,
            styles: resolvedStyles,
            mergedStyles,
            activeEffects,
        };
    }, [userUI]);
}
