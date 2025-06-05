import { NextResponse } from 'next/server';

// export const dynamic = 'force-dynamic';

export async function GET() {
    // Видалення hostOnly кукі
    const response = NextResponse.redirect(`${process.env.SITE_URL}`, {
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
