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

                    const headers = new Headers({
                        Location: `${baseURL}?auth=success&provider=google`,
                    });
                    headers.append(
                        'Set-Cookie',
                        makeCookieHeader('auth', res.secret),
                    );

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
