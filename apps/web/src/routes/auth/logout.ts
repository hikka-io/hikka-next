import { createFileRoute } from '@tanstack/react-router';

import { COOKIE, clearCookieHeader, getCookieDomain } from '@/utils/cookies';
import { getSiteUrl, resolveSameOriginUrl } from '@/utils/url';

export const Route = createFileRoute('/auth/logout')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const url = new URL(request.url);
                const callbackUrl = url.searchParams.get('callbackUrl') ?? '/';
                const siteUrl = getSiteUrl();

                const domain = getCookieDomain();

                const redirectTo =
                    resolveSameOriginUrl(callbackUrl, siteUrl)?.toString() ??
                    siteUrl;

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
