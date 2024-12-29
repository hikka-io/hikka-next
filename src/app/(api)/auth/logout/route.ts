import { cookies } from 'next/headers';

export async function GET() {
    (await cookies()).delete({
        name: 'auth',
        domain: process.env.COOKIE_DOMAIN,
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        sameSite: 'lax',
    });

    return Response.redirect(`${process.env.SITE_URL}`);
}
