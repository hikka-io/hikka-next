import { createFileRoute } from '@tanstack/react-router';

import { clearCookieHeader } from '@/utils/cookies/headers';

export const Route = createFileRoute('/api/auth/logout')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const url = new URL(request.url);
                const callbackUrl = url.searchParams.get('callbackUrl') ?? '/';
                const siteUrl =
                    import.meta.env.VITE_SITE_URL ?? 'http://localhost:3000';
                const domain = import.meta.env.COOKIE_DOMAIN;

                const target = new URL(callbackUrl, siteUrl);
                const isSafe = target.origin === new URL(siteUrl).origin;
                const redirectTo = isSafe ? target.toString() : siteUrl;

                const headers = new Headers({ Location: redirectTo });
                // Clear host-only cookies
                headers.append('Set-Cookie', clearCookieHeader('auth'));
                headers.append('Set-Cookie', clearCookieHeader('username'));
                // Clear domain-scoped cookies if COOKIE_DOMAIN is set
                if (domain) {
                    headers.append(
                        'Set-Cookie',
                        clearCookieHeader('auth', domain),
                    );
                    headers.append(
                        'Set-Cookie',
                        clearCookieHeader('username', domain),
                    );
                }

                return new Response(null, { status: 302, headers });
            },
        },
    },
});
