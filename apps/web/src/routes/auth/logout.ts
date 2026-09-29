import { createFileRoute } from '@tanstack/react-router';

import { COOKIE, clearCookieHeader, getCookieDomain } from '@/utils/cookies';

export const Route = createFileRoute('/auth/logout')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const url = new URL(request.url);
                const callbackUrl = url.searchParams.get('callbackUrl') ?? '/';
                const siteUrl =
                    import.meta.env.VITE_SITE_URL ?? 'http://localhost:3000';

                const domain = getCookieDomain();

                const target = new URL(callbackUrl, siteUrl);
                const isSafe = target.origin === new URL(siteUrl).origin;
                const redirectTo = isSafe ? target.toString() : siteUrl;

                const headers = new Headers({
                    Location: redirectTo,
                    'Cache-Control': 'no-store',
                });
                // Clear host-only cookies (in case they were set without Domain)
                headers.append(
                    'Set-Cookie',
                    clearCookieHeader(COOKIE.auth.name),
                );
                headers.append(
                    'Set-Cookie',
                    clearCookieHeader(COOKIE.legacyUsername.name, undefined, {
                        httpOnly: false,
                    }),
                );
                // Clear domain-scoped cookies if COOKIE_DOMAIN is set
                if (domain) {
                    headers.append(
                        'Set-Cookie',
                        clearCookieHeader(COOKIE.auth.name, domain),
                    );
                    headers.append(
                        'Set-Cookie',
                        clearCookieHeader(COOKIE.legacyUsername.name, domain, {
                            httpOnly: false,
                        }),
                    );
                }

                return new Response(null, { status: 302, headers });
            },
        },
    },
});
