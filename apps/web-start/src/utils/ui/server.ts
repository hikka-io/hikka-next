import { HikkaClient, UserUI } from '@hikka/client';
import { createServerFn } from '@tanstack/react-start';

import { getActiveEventTheme } from '@/utils/constants/event-themes';
import { createServerHikkaClient, parseCookies } from '@/utils/cookies';

import { DEFAULT_USER_UI } from './defaults';
import { stylesToCSS } from './inject-styles';
import { mergeStyles, mergeUserUI } from './merge';

// Module-level in-memory cache — lives for process lifetime (per-deployment).
// Invalidated on user settings update via invalidateUserUIFn.
interface CacheEntry {
    ui: UserUI;
    cachedAt: number;
}
const userUICache = new Map<string, CacheEntry>();

const CACHE_FRESH_MS = 5 * 60 * 1000; // < 5 min: serve immediately, no refresh
const CACHE_MAX_AGE_MS = 30 * 60 * 1000; // 5-30 min: serve stale + refresh in bg

// Deduplicates concurrent API calls for the same username (prevents thundering herd).
const inFlightRequests = new Map<string, Promise<UserUI | null>>();

async function fetchFromAPIAndCache(username: string): Promise<UserUI | null> {
    const existing = inFlightRequests.get(username);
    if (existing) return existing;

    const promise = (async () => {
        try {
            const ui = await createServerHikkaClient().user.getUserUI(username);
            userUICache.set(username, { ui, cachedAt: Date.now() });
            return ui;
        } catch {
            return null;
        } finally {
            inFlightRequests.delete(username);
        }
    })();

    inFlightRequests.set(username, promise);
    return promise;
}

// Plain async function — NOT a createServerFn, so calling it from another
// server fn handler does NOT trigger an RPC sub-request.
async function getUIFromCacheOrFetch(username: string): Promise<UserUI | null> {
    const entry = userUICache.get(username);
    if (entry) {
        const age = Date.now() - entry.cachedAt;
        if (age < CACHE_FRESH_MS) return entry.ui;
        if (age < CACHE_MAX_AGE_MS) {
            // Stale-while-revalidate: serve immediately, refresh in background
            fetchFromAPIAndCache(username).catch(() => {});
            return entry.ui;
        }
    }
    // No entry or too old — blocking fetch
    return fetchFromAPIAndCache(username);
}

export const fetchUserUIFn = createServerFn({ method: 'GET' })
    .inputValidator((data: { username: string }) => data)
    .handler(async ({ data: { username } }) => getUIFromCacheOrFetch(username));

export const invalidateUserUIFn = createServerFn({ method: 'POST' })
    .inputValidator((data: { username: string }) => data)
    .handler(async ({ data: { username } }) => {
        userUICache.delete(username);
    });

export const getSessionUserUI = createServerFn({ method: 'GET' }).handler(
    async (): Promise<UserUI> => {
        try {
            const { getRequest } = await import('@tanstack/react-start/server');
            const request = getRequest();
            const cookieHeader = request?.headers.get('cookie') ?? '';
            const cookies = parseCookies(cookieHeader);
            const username = cookies['username'];

            if (!username) return DEFAULT_USER_UI;

            const cachedUI = await getUIFromCacheOrFetch(username);
            return mergeUserUI(DEFAULT_USER_UI, cachedUI ?? undefined);
        } catch (error) {
            console.error('Failed to get session user UI', error);
            return DEFAULT_USER_UI;
        }
    },
);

export function getUserStylesCSS(userUI: UserUI): string {
    const eventTheme = getActiveEventTheme();
    const mergedStyles = mergeStyles(eventTheme?.styles, userUI.styles);
    return stylesToCSS(mergedStyles);
}

export const updateUserUIServerFn = createServerFn({ method: 'POST' })
    .inputValidator((data: Omit<UserUI, 'username'>) => data)
    .handler(async ({ data: userUI }): Promise<UserUI> => {
        try {
            const { getRequest } = await import('@tanstack/react-start/server');
            const request = getRequest();
            const cookieHeader = request?.headers.get('cookie') ?? '';
            const cookies = parseCookies(cookieHeader);
            const authToken = cookies['auth'];
            const username = cookies['username'];

            const client = new HikkaClient({
                baseUrl: import.meta.env.API_URL ?? 'https://api.hikka.io',
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
    });
