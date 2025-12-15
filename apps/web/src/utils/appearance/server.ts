import { HikkaClient, UserAppearance } from '@hikka/client';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';

import { getActiveEventTheme } from '@/utils/constants/event-themes';
import { getHikkaClientConfig } from '@/utils/hikka-client';

import { DEFAULT_APPEARANCE } from './defaults';
import { stylesToCSS } from './inject-styles';
import { mergeStyles } from './merge';

/**
 * Cached per-user UI appearance fetch.
 *
 * - Keyed by username
 * - Tagged so POST updates can `revalidateTag('user-ui:${username}')`
 */
export const getCachedUserUI = cache(
    async (username: string): Promise<UserAppearance> => {
        const config = await getHikkaClientConfig();
        const client = new HikkaClient(config);

        const cachedFetch = unstable_cache(
            async () => client.user.getUserUI(username),
            ['user-ui', username],
            {
                tags: [`user-ui:${username}`],
            },
        );

        try {
            return await cachedFetch();
        } catch {
            return DEFAULT_APPEARANCE;
        }
    },
);

/**
 * Get user appearance for the current session.
 *
 * If the user is not authenticated, falls back to DEFAULT_APPEARANCE.
 */
export async function getSessionUserUI(): Promise<UserAppearance> {
    const config = await getHikkaClientConfig();
    const client = new HikkaClient(config);

    try {
        const me = await client.user.getCurrentUser();
        const ui = await getCachedUserUI(me.username);

        return ui;
    } catch {
        return DEFAULT_APPEARANCE;
    }
}

/**
 * Get merged styles as CSS string for SSR injection
 */
export async function getUserStylesCSS(
    appearance?: UserAppearance,
): Promise<string> {
    const resolvedAppearance = appearance ?? (await getSessionUserUI());
    const eventTheme = getActiveEventTheme();
    const mergedStyles = mergeStyles(
        eventTheme?.styles,
        resolvedAppearance.styles,
    );

    return stylesToCSS(mergedStyles);
}
