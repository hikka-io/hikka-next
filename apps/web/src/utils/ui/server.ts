'use server';

import { HikkaClient, UserUI } from '@hikka/client';
import { unstable_cache, updateTag } from 'next/cache';
import { cache } from 'react';

import { getActiveEventTheme } from '@/utils/constants/event-themes';
import { getHikkaClientConfig } from '@/utils/hikka-client';

import { getCookie } from '../cookies';
import { DEFAULT_USER_UI } from './defaults';
import { stylesToCSS } from './inject-styles';
import { mergeStyles, mergeUserUI } from './merge';

/**
 * Cached per-user UI fetch.
 */
export const getCachedUserUI = cache(
    async (username: string): Promise<UserUI> => {
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
            return DEFAULT_USER_UI;
        }
    },
);

/**
 * Get user UI for the current session.

 */
export async function getSessionUserUI(): Promise<UserUI> {
    try {
        let currentUsername = await getCookie('username');

        if (!currentUsername) {
            return DEFAULT_USER_UI;
        }

        const ui = await getCachedUserUI(currentUsername ?? '');

        return mergeUserUI(DEFAULT_USER_UI, ui);
    } catch (error) {
        console.error('Failed to get session user UI', error);
        return DEFAULT_USER_UI;
    }
}

/**
 * Get merged styles as CSS string for SSR injection
 */
export async function getUserStylesCSS(userUI?: UserUI): Promise<string> {
    const resolvedUserUI = userUI ?? (await getSessionUserUI());
    const eventTheme = getActiveEventTheme();
    const mergedStyles = mergeStyles(eventTheme?.styles, resolvedUserUI.styles);

    return stylesToCSS(mergedStyles);
}

/**
 * Server action to update the user's UI and revalidate the cache.
 */

export async function updateUserUI(
    userUI: Omit<UserUI, 'username'>,
): Promise<UserUI> {
    try {
        const config = await getHikkaClientConfig();
        const client = new HikkaClient(config);

        const currentUsername = await getCookie('username');

        const updatedUserUI = await client.settings.updateUserUI(userUI);

        updateTag(`user-ui:${currentUsername}`);

        return updatedUserUI;
    } catch (error) {
        console.error('Failed to update user UI:', error);
        throw error;
    }
}
