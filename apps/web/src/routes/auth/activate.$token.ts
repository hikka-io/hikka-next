import { createFileRoute } from '@tanstack/react-router';

import { activation } from '@hikka/api';

import { firstForwardedIp } from '@/utils/api/client-ip';
import {
    createServerHikkaClient,
    makeCookieHeader,
} from '@/utils/cookies/headers';

export const Route = createFileRoute('/auth/activate/$token')({
    server: {
        handlers: {
            GET: async ({ params, request }) => {
                try {
                    const client = createServerHikkaClient(
                        firstForwardedIp(
                            request.headers.get('x-forwarded-for'),
                        ),
                    );
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
