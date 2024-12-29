import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.redirect(`${process.env.SITE_URL}`);

    response.cookies.set('auth', '', {
        path: '/',
        expires: new Date(0),
        domain: process.env.COOKIE_DOMAIN,
        httpOnly: process.env.COOKIE_HTTP_ONLY === 'true',
    });

    response.cookies.set('auth', '', {
        path: '/',
        expires: new Date(0),
    });

    return response;
}
