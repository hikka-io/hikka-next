import { createServerFn } from '@tanstack/react-start';

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

// Rolling cookie: re-set auth and username cookies with a fresh 30-day maxAge.
// Called on every SSR request to prevent active users from being logged out
// or losing their custom styles.
export const refreshAuthCookieFn = createServerFn({ method: 'POST' }).handler(
    async () => {
        const { getCookie, setCookie } = await import(
            '@tanstack/react-start/server'
        );
        const token = getCookie('auth');
        if (!token) return;

        const domain = import.meta.env.COOKIE_DOMAIN;
        const secure = !!domain && domain !== 'localhost';
        const maxAge = 60 * 60 * 24 * 30; // 30 days

        setCookie('auth', token, {
            maxAge,
            path: '/',
            httpOnly: true,
            secure,
            sameSite: 'lax',
            ...(domain ? { domain } : {}),
        });

        const username = getCookie('username');
        if (username) {
            setCookie('username', username, {
                maxAge,
                path: '/',
                httpOnly: false,
                secure,
                sameSite: 'lax',
                ...(domain ? { domain } : {}),
            });
        }

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
