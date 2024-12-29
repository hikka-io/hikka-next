import { NextResponse } from 'next/server';

export async function GET() {
    const response = NextResponse.redirect(`${process.env.SITE_URL}`);

    response.cookies.set('auth', '', {
        path: '/',
        expires: new Date(0),
    });

    return response;
}
