import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic';

export async function GET() {
    const cookieStore = await cookies();
    const response = NextResponse.redirect(`${process.env.SITE_URL}`);

    cookieStore.delete({
        name: 'auth',
        domain: process.env.COOKIE_DOMAIN,
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        sameSite: 'lax',
    });

    cookieStore.delete({
        name: 'auth',
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
        sameSite: 'lax',
    });

    return response;
}
