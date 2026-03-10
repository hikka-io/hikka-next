'use server';

import { HikkaClient, UserUI } from '@hikka/client';
import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

import { getActiveEventTheme } from '@/utils/constants/event-themes';

import { DEFAULT_USER_UI } from './defaults';
import { stylesToCSS } from './inject-styles';
import { mergeStyles, mergeUserUI } from './merge';

// Module-level in-memory cache — lives for process lifetime (per-deployment).
// Invalidated on user settings update via invalidateUserUIFn.
const userUICache = new Map<string, UserUI>();

export const fetchUserUIFn = createServerFn({ method: 'GET' })
    .inputValidator((data: { username: string }) => data)
    .handler(async ({ data: { username } }) => {
        if (userUICache.has(username)) {
            return userUICache.get(username)!;
        }
        const client = new HikkaClient({
            baseUrl: process.env.API_URL ?? 'https://api.hikka.io',
        });
        try {
            const ui = await client.user.getUserUI(username);
            userUICache.set(username, ui);
            return ui;
        } catch {
            return null;
        }
    });

export const invalidateUserUIFn = createServerFn({ method: 'POST' })
    .inputValidator((data: { username: string }) => data)
    .handler(async ({ data: { username } }) => {
        userUICache.delete(username);
    });

function parseCookies(cookieHeader: string): Record<string, string> {
    return Object.fromEntries(
        cookieHeader
            .split(';')
            .map((c) => {
                const [key, ...vals] = c.trim().split('=');
                return [key, decodeURIComponent(vals.join('='))];
            })
            .filter(([key]) => key),
    );
}

export async function getSessionUserUI(): Promise<UserUI> {
    try {
        const request = getRequest();
        const cookieHeader = request?.headers.get('cookie') ?? '';
        const cookies = parseCookies(cookieHeader);
        const username = cookies['username'];

        if (!username) return DEFAULT_USER_UI;

        const cachedUI = await fetchUserUIFn({ data: { username } });
        return mergeUserUI(DEFAULT_USER_UI, cachedUI ?? undefined);
    } catch (error) {
        console.error('Failed to get session user UI', error);
        return DEFAULT_USER_UI;
    }
}

export async function getUserStylesCSS(userUI?: UserUI): Promise<string> {
    const resolvedUserUI = userUI ?? (await getSessionUserUI());
    const eventTheme = getActiveEventTheme();
    const mergedStyles = mergeStyles(eventTheme?.styles, resolvedUserUI.styles);

    return stylesToCSS(mergedStyles);
}

export async function updateUserUIServerFn(
    userUI: Omit<UserUI, 'username'>,
): Promise<UserUI> {
    try {
        const request = getRequest();
        const cookieHeader = request?.headers.get('cookie') ?? '';
        const cookies = parseCookies(cookieHeader);
        const authToken = cookies['auth'];
        const username = cookies['username'];

        const client = new HikkaClient({
            baseUrl: process.env.API_URL ?? 'https://api.hikka.io',
            authToken,
        });

        const updatedUI = await client.settings.updateUserUI(userUI);

        // Invalidate cache so next page load fetches fresh data
        if (username) {
            userUICache.delete(username);
        }

        return updatedUI;
    } catch (error) {
        console.error('Failed to update user UI:', error);
        throw error;
    }
}
