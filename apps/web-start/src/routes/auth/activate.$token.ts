import { createFileRoute } from '@tanstack/react-router';

import { activation } from '@hikka/api';

import {
    appendUsernameCookie,
    createServerHikkaClient,
    makeCookieHeader,
} from '@/utils/cookies/headers';

export const Route = createFileRoute('/auth/activate/$token')({
    server: {
        handlers: {
            GET: async ({ params }) => {
                try {
                    const client = createServerHikkaClient();
                    const { data: res } = await activation({
                        client,
                        body: { token: params.token },
                        throwOnError: true,
                    });

                    const headers = new Headers({ Location: '/' });
                    headers.append(
                        'Set-Cookie',
                        makeCookieHeader('auth', res.secret),
                    );
                    await appendUsernameCookie(headers, res.secret);

                    return new Response(null, { status: 302, headers });
                } catch {
                    return new Response(null, {
                        status: 302,
                        headers: { Location: '/' },
                    });
                }
            },
        },
    },
});
