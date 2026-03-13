import { HikkaClient } from '@hikka/client';
import { createServerFn } from '@tanstack/react-start';

/**
 * Server function that sets HttpOnly auth and username cookies.
 * Called from client after a successful login/signup/password-reset mutation.
 * Returns the auth token so the client can set it on HikkaClient in memory.
 */
export const setAuthCookieFn = createServerFn({ method: 'POST' })
    .inputValidator((data: { secret: string; expiration: number }) => data)
    .handler(async ({ data: { secret, expiration } }) => {
        const { setCookie } = await import('@tanstack/react-start/server');

        const domain = process.env.COOKIE_DOMAIN;
        const secure = !!domain && domain !== 'localhost';
        const maxAge = Math.max(
            0,
            expiration - Math.floor(Date.now() / 1000),
        );

        setCookie('auth', secret, {
            maxAge,
            path: '/',
            httpOnly: true,
            secure,
            sameSite: 'lax',
            ...(domain ? { domain } : {}),
        });

        // Fetch username to set the username cookie (used for UI cache)
        try {
            const client = new HikkaClient({
                baseUrl: process.env.API_URL ?? 'https://api.hikka.io',
                authToken: secret,
            });
            const user = await client.user.getCurrentUser();

            setCookie('username', user.username, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
                httpOnly: false,
                secure,
                sameSite: 'lax',
                ...(domain ? { domain } : {}),
            });
        } catch {
            // Username cookie is non-critical; auth cookie is already set
        }

        return { authToken: secret };
    });
