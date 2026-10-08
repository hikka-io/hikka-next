import { createFileRoute } from '@tanstack/react-router';

import { HikkaApiError, oauthToken } from '@hikka/api';

import { firstForwardedIp } from '@/utils/api/client-ip';
import { createServerHikkaClient } from '@/utils/api/server-client';
import { COOKIE, makeCookieHeader } from '@/utils/cookies';
import { getSiteUrl, resolveSameOriginUrl } from '@/utils/url';

export const Route = createFileRoute('/auth/google')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const url = new URL(request.url);
                const code = url.searchParams.get('code');
                const state = url.searchParams.get('state') ?? '/';
                const siteUrl = getSiteUrl();
                const redirectBase =
                    resolveSameOriginUrl(state, siteUrl) ?? new URL(siteUrl);

                try {
                    const client = createServerHikkaClient(
                        firstForwardedIp(
                            request.headers.get('x-forwarded-for'),
                        ),
                    );
                    const { data: res } = await oauthToken({
                        client,
                        path: { provider: 'google' },
                        body: { code: String(code) },
                        throwOnError: true,
                    });

                    const location = new URL(redirectBase);
                    location.searchParams.set('auth', 'success');
                    location.searchParams.set('provider', 'google');

                    const headers = new Headers({
                        Location: location.toString(),
                    });
                    headers.append(
                        'Set-Cookie',
                        makeCookieHeader(COOKIE.auth.name, res.secret),
                    );

                    return new Response(null, { status: 302, headers });
                } catch (e) {
                    const errorCode =
                        e instanceof HikkaApiError ? e.code : String(e);

                    const location = new URL(redirectBase);
                    location.searchParams.set('auth', 'error');
                    location.searchParams.set('provider', 'google');
                    location.searchParams.set('error', errorCode);

                    return new Response(null, {
                        status: 302,
                        headers: { Location: location.toString() },
                    });
                }
            },
        },
    },
});
