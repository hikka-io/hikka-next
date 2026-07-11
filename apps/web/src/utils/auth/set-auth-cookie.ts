import { createServerFn } from '@tanstack/react-start';

import { getCookieDomain, isSecureCookieDomain } from '@/utils/cookies';

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
        const maxAge = 60 * 60 * 24 * 30; // 30 days

        // Clear legacy host-only cookies that would shadow the domain-scoped
        // ones on read. (`username` is retired but purged for old clients.)
        if (domain) {
            setCookie('auth', '', { maxAge: 0, path: '/' });
            setCookie('username', '', { maxAge: 0, path: '/' });
        }

        setCookie('auth', secret, {
            maxAge,
            path: '/',
            httpOnly: true,
            secure,
            sameSite: 'lax',
            ...(domain ? { domain } : {}),
        });

        return { authToken: secret };
    });
