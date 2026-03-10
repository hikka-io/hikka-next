import { HikkaClient } from '@hikka/client';
import { createFileRoute, redirect } from '@tanstack/react-router';

const client = new HikkaClient({
    baseUrl: process.env.API_URL ?? 'https://api.hikka.io',
});

function makeCookieHeader(name: string, value: string): string {
    const domain = process.env.COOKIE_DOMAIN;
    const httpOnly = process.env.COOKIE_HTTP_ONLY === 'true';
    const maxAge = 60 * 60 * 24 * 30; // 30 days
    return [
        `${name}=${encodeURIComponent(value)}`,
        `Max-Age=${maxAge}`,
        'Path=/',
        domain ? `Domain=${domain}` : '',
        httpOnly ? 'HttpOnly' : '',
        'SameSite=Lax',
    ]
        .filter(Boolean)
        .join('; ');
}

export const Route = createFileRoute('/api/auth/activate/$token')({
    server: {
        handlers: {
            GET: async ({ params }) => {
                const { token } = params;

                try {
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
