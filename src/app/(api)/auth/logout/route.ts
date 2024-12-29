import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        (await cookies()).delete({
            name: 'auth',
            domain: process.env.COOKIE_DOMAIN,
        });
    } catch (e) {
        (await cookies()).delete({
            name: 'auth',
        });
    }

    return Response.redirect(`${process.env.SITE_URL}`);
}
