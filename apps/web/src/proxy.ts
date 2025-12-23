import { HikkaClient } from '@hikka/client';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
    const response = NextResponse.next();

    const auth = request.cookies.get('auth')?.value;
    const username = request.cookies.get('username')?.value;

    if (auth && !username) {
        try {
            const client = new HikkaClient({
                baseUrl: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL,
                authToken: auth,
            });

            const me = await client.user.getCurrentUser();

            if (me?.username) {
                response.cookies.set('username', me.username, {
                    maxAge: 30 * 24 * 60 * 60,
                    httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
                    sameSite: 'lax',
                    domain: process.env.COOKIE_DOMAIN,
                });
            }
        } catch (error) {
            console.error('Failed to fetch user in proxy:', error);
        }
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
