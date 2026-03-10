import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/auth/logout')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const url = new URL(request.url);
                const callbackUrl = url.searchParams.get('callbackUrl') ?? '/';
                const siteUrl =
                    process.env.SITE_URL ?? 'http://localhost:3001';
                const domain = process.env.COOKIE_DOMAIN;

                const target = new URL(callbackUrl, siteUrl);
                const isSafe =
                    target.origin === new URL(siteUrl).origin;
                const redirectTo = isSafe ? target.toString() : siteUrl;

                const clearCookie = (name: string, d?: string) =>
                    [
                        `${name}=`,
                        'Max-Age=0',
                        'Path=/',
                        d ? `Domain=${d}` : '',
                        'HttpOnly',
                        'SameSite=Lax',
                    ]
                        .filter(Boolean)
                        .join('; ');

                const headers = new Headers({ Location: redirectTo });
                // Clear host-only cookies
                headers.append('Set-Cookie', clearCookie('auth'));
                headers.append('Set-Cookie', clearCookie('username'));
                // Clear domain-scoped cookies if COOKIE_DOMAIN is set
                if (domain) {
                    headers.append('Set-Cookie', clearCookie('auth', domain));
                    headers.append(
                        'Set-Cookie',
                        clearCookie('username', domain),
                    );
                }

                return new Response(null, { status: 302, headers });
            },
        },
    },
});
