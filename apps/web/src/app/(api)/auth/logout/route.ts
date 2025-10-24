import { NextRequest, NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const callbackUrl = searchParams.get('callbackUrl') ?? '/';

    const url = new URL(callbackUrl, process.env.SITE_URL);
    const isSafe = url.origin === new URL(process.env.SITE_URL!).origin;
    const redirectUrl = isSafe ? url : process.env.SITE_URL!;

    // Видалення hostOnly кукі
    const response = NextResponse.redirect(redirectUrl, {
        headers: {
            'Set-Cookie': 'auth=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax',
        },
    });

    // Видалення кукі з доменом
    response.headers.append(
        'Set-Cookie',
        'auth=; Max-Age=0; Path=/; Domain=.hikka.io; HttpOnly; SameSite=Lax',
    );

    return response;
}
