import { createServerFn } from '@tanstack/react-start';

import { getCookieDomain, isSecureCookieDomain } from './domain';

// Server function for isomorphic use (works from both server and client via RPC)
export const getAuthTokenFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getCookie } = await import('@tanstack/react-start/server');
        return getCookie('auth') ?? null;
    },
);

export const getThemeCookieFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getCookie } = await import('@tanstack/react-start/server');
        return (getCookie('theme') as 'light' | 'dark' | 'system') ?? null;
    },
);

// Rolling cookie: re-set the auth (and theme) cookies with a fresh maxAge on
// every SSR request, so active users aren't logged out or lose their theme.
export const refreshAuthCookieFn = createServerFn({ method: 'POST' }).handler(
    async () => {
        const { getCookie, setCookie } = await import(
            '@tanstack/react-start/server'
        );
        const token = getCookie('auth');
        if (!token) return;

        const domain = getCookieDomain();
        const secure = isSecureCookieDomain(domain);
        const maxAge = 60 * 60 * 24 * 30; // 30 days

        setCookie('auth', token, {
            maxAge,
            path: '/',
            httpOnly: true,
            secure,
            sameSite: 'lax',
            ...(domain ? { domain } : {}),
        });

        const theme = getCookie('theme');
        if (theme) {
            setCookie('theme', theme, {
                maxAge: 60 * 60 * 24 * 365, // 1 year
                path: '/',
                httpOnly: false,
                secure,
                sameSite: 'lax',
                ...(domain ? { domain } : {}),
            });
        }
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
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
            httpOnly: false,
            secure,
            sameSite: 'lax',
            ...(domain ? { domain } : {}),
        });
    },
);
