import { useMemo } from 'react';

import { useQuery } from '@tanstack/react-query';

import { profileUiOptions } from '@hikka/api';

import type { UIEffect, UIStyles, UserUI } from '@/types/ui';
import { getActiveEventTheme } from '@/utils/constants/event-themes';
import { DEFAULT_USER_UI, mergeEffects, mergeStyles } from '@/utils/ui';

interface SessionUI {
    preferences: NonNullable<UserUI['preferences']>;
    styles: UIStyles;
    mergedStyles: UIStyles;
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
    const userUI = (data as UserUI | undefined) ?? DEFAULT_USER_UI;

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
