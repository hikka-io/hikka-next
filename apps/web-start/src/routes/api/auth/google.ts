import { createFileRoute } from '@tanstack/react-router';

import {
    createServerHikkaClient,
    makeCookieHeader,
} from '@/utils/cookies/headers';

export const Route = createFileRoute('/api/auth/google')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const url = new URL(request.url);
                const code = url.searchParams.get('code');
                const baseURL = url.searchParams.get('state') ?? '/';

                try {
                    const client = createServerHikkaClient();
                    const res = await client.auth.createOAuthToken('google', {
                        code: String(code),
                    });

                    // Fixed 30-day maxAge — API extends token on each
                    // authenticated request; cookie should outlive the token.
                    const maxAge = 60 * 60 * 24 * 30;

                    const headers = new Headers({
                        Location: `${baseURL}?auth=success&provider=google`,
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
                    const errorCode =
                        'code' in e ? e.code : String(e);

                    return new Response(null, {
                        status: 302,
                        headers: {
                            Location: `${baseURL}?auth=error&provider=google&error=${errorCode}`,
                        },
                    });
                }
            },
        },
    },
});
