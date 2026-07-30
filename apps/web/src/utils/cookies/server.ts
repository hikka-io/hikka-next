import { createServerFn } from '@tanstack/react-start';

import { firstForwardedIp } from '@/utils/api/client-ip';

import { getCookieDomain, isSecureCookieDomain } from './domain';
import { parseUiPrefs, UI_PREFS_COOKIE } from './ui-prefs';

// Server function for isomorphic use (works from both server and client via RPC)
export const getAuthTokenFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getCookie } = await import('@tanstack/react-start/server');
        return getCookie('auth') ?? null;
    },
);

export const getClientIpFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getRequestHeader } = await import(
            '@tanstack/react-start/server'
        );
        return firstForwardedIp(getRequestHeader('x-forwarded-for')) ?? null;
    },
);

export const getThemeCookieFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getCookie } = await import('@tanstack/react-start/server');
        return (getCookie('theme') as 'light' | 'dark' | 'system') ?? null;
    },
);

// Rolling cookie: re-set the auth cookie with a fresh maxAge on every SSR
// request, so active users aren't logged out. `theme`/`ui-prefs` must NOT be
// refreshed here — re-setting them with a domain shadows the host-only cookies
// the client writes, freezing every UI preference. See `ui-cookie.ts`.
export const refreshAuthCookieFn = createServerFn({ method: 'POST' }).handler(
    async () => {
        const { getCookie, setCookie } = await import(
            '@tanstack/react-start/server'
        );
        const token = getCookie('auth');
        if (!token) return;

        const domain = getCookieDomain();
        const secure = isSecureCookieDomain(domain);

        setCookie('auth', token, {
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
            httpOnly: true,
            secure,
            sameSite: 'lax',
            ...(domain ? { domain } : {}),
        });
    },
);

export const getUiPrefsCookieFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getCookie } = await import('@tanstack/react-start/server');
        return parseUiPrefs(getCookie(UI_PREFS_COOKIE));
    },
);

export const getNsfwConsentFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getCookie } = await import('@tanstack/react-start/server');
        return getCookie('nsfw_confirmed') ?? null;
    },
);

export const setNsfwConsentFn = createServerFn({ method: 'POST' }).handler(
    async () => {
        const { setCookie } = await import('@tanstack/react-start/server');
        const domain = getCookieDomain();
        const secure = isSecureCookieDomain(domain);

        setCookie('nsfw_confirmed', '1', {
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
            httpOnly: false,
            secure,
            sameSite: 'lax',
            ...(domain ? { domain } : {}),
        });
    },
);

export const clearNsfwConsentFn = createServerFn({ method: 'POST' }).handler(
    async () => {
        const { deleteCookie } = await import('@tanstack/react-start/server');
        const domain = getCookieDomain();

        deleteCookie('nsfw_confirmed', {
            path: '/',
            ...(domain ? { domain } : {}),
        });
    },
);
