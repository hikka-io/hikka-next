import { HikkaClient } from '@hikka/client';
import { createFileRoute } from '@tanstack/react-router';

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

export const Route = createFileRoute('/api/auth/google')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const url = new URL(request.url);
                const code = url.searchParams.get('code');
                const baseURL = url.searchParams.get('state') ?? '/';

                try {
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
