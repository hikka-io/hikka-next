import { createServerFn } from '@tanstack/react-start';

import { COOKIE } from './constants';
import { getCookieDomain, isSecureCookieDomain } from './domain';
import { parseUiPrefs } from './ui-prefs';

// Server function for isomorphic use (works from both server and client via RPC)
export const getAuthTokenFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getCookie } = await import('@tanstack/react-start/server');
        return getCookie(COOKIE.auth.name) ?? null;
    },
);

export const getThemeCookieFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getCookie } = await import('@tanstack/react-start/server');
        return (
            (getCookie(COOKIE.theme.name) as 'light' | 'dark' | 'system') ??
            null
        );
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
        const token = getCookie(COOKIE.auth.name);
        if (!token) return;

        const domain = getCookieDomain();
        const secure = isSecureCookieDomain(domain);

        setCookie(COOKIE.auth.name, token, {
            maxAge: COOKIE.auth.maxAge,
            path: '/',
            httpOnly: true,
            secure,
            sameSite: 'lax',
            ...(domain ? { domain } : {}),
        });
    },
);

/**
 * Server function that sets the HttpOnly auth cookie.
 * Called from client after a successful login/signup/password-reset mutation.
 * Returns the auth token so the client can set it on HikkaClient in memory.
 */
export const setAuthCookieFn = createServerFn({ method: 'POST' })
    .validator((data: { secret: string }) => data)
    .handler(async ({ data: { secret } }) => {
        const { setCookie } = await import('@tanstack/react-start/server');

        const domain = getCookieDomain();
        const secure = isSecureCookieDomain(domain);

        // Clear legacy host-only cookies that would shadow the domain-scoped
        // ones on read. (`username` is retired but purged for old clients.)
        if (domain) {
            setCookie(COOKIE.auth.name, '', { maxAge: 0, path: '/' });
            setCookie(COOKIE.legacyUsername.name, '', { maxAge: 0, path: '/' });
        }

        setCookie(COOKIE.auth.name, secret, {
            maxAge: COOKIE.auth.maxAge,
            path: '/',
            httpOnly: true,
            secure,
            sameSite: 'lax',
            ...(domain ? { domain } : {}),
        });

        return { authToken: secret };
    });

export const getUiPrefsCookieFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getCookie } = await import('@tanstack/react-start/server');
        return parseUiPrefs(getCookie(COOKIE.uiPrefs.name));
    },
);

export const getNsfwConsentFn = createServerFn({ method: 'GET' }).handler(
    async () => {
        const { getCookie } = await import('@tanstack/react-start/server');
        return getCookie(COOKIE.nsfwConsent.name) ?? null;
    },
);

export const setNsfwConsentFn = createServerFn({ method: 'POST' }).handler(
    async () => {
        const { setCookie } = await import('@tanstack/react-start/server');
        const domain = getCookieDomain();
        const secure = isSecureCookieDomain(domain);

        setCookie(COOKIE.nsfwConsent.name, '1', {
            maxAge: COOKIE.nsfwConsent.maxAge,
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

        deleteCookie(COOKIE.nsfwConsent.name, {
            path: '/',
            ...(domain ? { domain } : {}),
        });
    },
);
