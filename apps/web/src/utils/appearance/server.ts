'use server';

import { HikkaClient, UserAppearance } from '@hikka/client';
import { unstable_cache, updateTag } from 'next/cache';
import { cache } from 'react';

import { getActiveEventTheme } from '@/utils/constants/event-themes';
import { getHikkaClientConfig } from '@/utils/hikka-client';

import { getCookie } from '../cookies';
import { DEFAULT_APPEARANCE } from './defaults';
import { stylesToCSS } from './inject-styles';
import { mergeStyles, mergeUserUI } from './merge';

/**
 * Cached per-user UI appearance fetch.
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
        } catch (error) {
            console.error('Failed to get cached user UI', error);
            return DEFAULT_APPEARANCE;
        }
    },
);

/**
 * Get user appearance for the current session.

 */
export async function getSessionUserUI(): Promise<UserAppearance> {
    try {
        let currentUsername = await getCookie('username');
        const ui = await getCachedUserUI(currentUsername ?? '');

        return mergeUserUI(DEFAULT_APPEARANCE, ui);
    } catch (error) {
        console.error('Failed to get session user UI', error);
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

/**
 * Server action to update the user's UI appearance and revalidate the cache.
 */

export async function updateUserUI(
    appearance: Omit<UserAppearance, 'username'>,
): Promise<UserAppearance> {
    try {
        const config = await getHikkaClientConfig();
        const client = new HikkaClient(config);

        const currentUsername = await getCookie('username');

        const updatedAppearance =
            await client.settings.updateUserUI(appearance);

        updateTag(`user-ui:${currentUsername}`);

        return updatedAppearance;
    } catch (error) {
        console.error('Failed to update user UI:', error);
        throw error;
    }
}
