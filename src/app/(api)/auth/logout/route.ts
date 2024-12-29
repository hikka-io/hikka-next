import { cookies } from 'next/headers';

export async function GET() {
    (await cookies()).delete({
        name: 'auth',
        domain: process.env.COOKIE_DOMAIN,
    });

    return Response.redirect(`${process.env.SITE_URL}`);
}
