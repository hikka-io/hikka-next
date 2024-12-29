import { cookies } from 'next/headers';

// export const dynamic = 'force-dynamic';

export async function GET() {
    const cookieStore = await cookies();

    cookieStore.getAll().forEach((cookie) => {
        console.log(cookie);
        cookieStore.delete(cookie);
    });

    (await cookies()).delete({
        name: 'auth',
        domain: process.env.COOKIE_DOMAIN,
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        sameSite: 'lax',
    });

    return Response.redirect(`${process.env.SITE_URL}`);
}
