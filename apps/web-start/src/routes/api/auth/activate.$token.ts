import { createFileRoute } from '@tanstack/react-router';

import {
    createServerHikkaClient,
    makeCookieHeader,
} from '@/utils/cookies/headers';

export const Route = createFileRoute('/api/auth/activate/$token')({
    server: {
        handlers: {
            GET: async ({ params }) => {
                const { token } = params;

                try {
                    const client = createServerHikkaClient();
                    const res = await client.auth.activateUser({ token });

                    const headers = new Headers({
                        Location: '/anime?page=1&activation=success',
                    });
                    headers.append(
                        'Set-Cookie',
                        makeCookieHeader('auth', res.secret),
                    );

                    return new Response(null, { status: 302, headers });
                } catch (e: any) {
                    if ('code' in e) {
                        if (e.code === 'auth-modal:activation_expired') {
                            return new Response(null, {
                                status: 302,
                                headers: {
                                    Location: '/anime?activation=resend',
                                },
                            });
                        }

                        return new Response(null, {
                            status: 302,
                            headers: {
                                Location:
                                    '/anime?page=1&activation=error&error=' +
                                    e.code,
                            },
                        });
                    }

                    return new Response(null, {
                        status: 302,
                        headers: {
                            Location:
                                '/anime?page=1&activation=error&error=' +
                                String(e),
                        },
                    });
                }
            },
        },
    },
});
