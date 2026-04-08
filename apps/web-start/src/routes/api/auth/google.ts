import { createFileRoute } from '@tanstack/react-router';

import {
    createServerHikkaClient,
    makeCookieHeader,
} from '@/utils/cookies/headers';
import { getSiteUrl } from '@/utils/url';

const resolveRedirectBase = (state: string, siteUrl: string): URL => {
    try {
        const target = new URL(state, siteUrl);
        if (target.origin === new URL(siteUrl).origin) return target;
    } catch {
        // ignore
    }
    return new URL(siteUrl);
};

export const Route = createFileRoute('/api/auth/google')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const url = new URL(request.url);
                const code = url.searchParams.get('code');
                const state = url.searchParams.get('state') ?? '/';
                const redirectBase = resolveRedirectBase(state, getSiteUrl());

                try {
                    const client = createServerHikkaClient();
                    const res = await client.auth.createOAuthToken('google', {
                        code: String(code),
                    });

                    // Fixed 30-day maxAge — API extends token on each
                    // authenticated request; cookie should outlive the token.
                    const maxAge = 60 * 60 * 24 * 30;

                    const location = new URL(redirectBase);
                    location.searchParams.set('auth', 'success');
                    location.searchParams.set('provider', 'google');

                    const headers = new Headers({
                        Location: location.toString(),
                    });
                    headers.append(
                        'Set-Cookie',
                        makeCookieHeader('auth', res.secret, { maxAge }),
                    );

                    // Set username cookie for UI cache
                    try {
                        client.setAuthToken(res.secret);
                        const user = await client.user.getCurrentUser();
                        headers.append(
                            'Set-Cookie',
                            makeCookieHeader('username', user.username, {
                                httpOnly: false,
                            }),
                        );
                    } catch {
                        // Username cookie is non-critical
                    }

                    return new Response(null, { status: 302, headers });
                } catch (e: any) {
                    const errorCode = 'code' in e ? e.code : String(e);

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
