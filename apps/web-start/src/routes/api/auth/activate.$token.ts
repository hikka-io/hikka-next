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

                    // Fixed 30-day maxAge — API extends token on each
                    // authenticated request; cookie should outlive the token.
                    const maxAge = 60 * 60 * 24 * 30;

                    const headers = new Headers({
                        Location: '/anime?page=1&activation=success',
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
