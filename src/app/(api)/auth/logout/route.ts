import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    const cookieStore = await cookies();

    try {
        cookieStore.delete({
            name: 'auth',
            domain: process.env.COOKIE_DOMAIN,
        });

        cookieStore.getAll().forEach((cookie) => {
            cookieStore.delete(cookie.name);
        });
    } catch (e) {
        console.error(e);
    }

    return Response.redirect(`${process.env.SITE_URL}`);
}
