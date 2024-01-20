import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('cookie', '');

    requestHeaders.set('x-forwarded-for', request.headers.get('x-vercel-forwarded-for')!);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: '/proxy/api/event',
}