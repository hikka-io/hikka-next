import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    if (/^\/api/.test(request.nextUrl.pathname)) {
        const authToken = cookies().get('auth')?.value;
        const newResponse = NextResponse.next();

        newResponse.headers.set('Auth', authToken || '');

        return newResponse;
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
