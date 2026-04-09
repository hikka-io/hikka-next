import { HikkaApiError } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

import {
    appendUsernameCookie,
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

export const Route = createFileRoute('/auth/google')({
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

                    const location = new URL(redirectBase);
                    location.searchParams.set('auth', 'success');
                    location.searchParams.set('provider', 'google');

                    const headers = new Headers({
                        Location: location.toString(),
                    });
                    headers.append(
                        'Set-Cookie',
                        makeCookieHeader('auth', res.secret),
                    );
                    await appendUsernameCookie(headers, client, res.secret);

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
