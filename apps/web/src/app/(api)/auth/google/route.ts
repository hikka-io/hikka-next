import { HikkaClient } from '@hikka/client';
import { redirect } from 'next/navigation';

import { setCookie } from '@/utils/cookies';

export const dynamic = 'force-dynamic';

const client = new HikkaClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const baseURL = searchParams.get('state') ? searchParams.get('state') : '/';
    const code = searchParams.get('code');

    try {
        const res = await client.auth.getOAuthToken('google', {
            code: String(code),
        });

        await setCookie('auth', res.secret);
    } catch (e) {
        if ('code' in (e as any)) {
            return redirect(
                `${baseURL}?auth=error&provider=google&error=` +
                    (e as any).code,
            );
        }

        return redirect(`${baseURL}?auth=error&provider=google&error=` + e);
    }

    return redirect(`${baseURL}?auth=success&provider=google`);
}
