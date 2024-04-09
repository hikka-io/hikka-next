import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import loginOAuth from '@/services/api/auth/loginOAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const res = await loginOAuth({
            code: String(code),
            provider: 'google',
        });

        cookies().set('auth', res.secret, {
            maxAge: 60 * 60 * 24 * 7,
        });
    } catch (e) {
        if ('code' in (e as API.Error)) {
            return redirect(
                '/anime?page=1&iPage=1&auth=error&provider=google&error=' +
                    (e as API.Error).code,
            );
        }

        return redirect(
            '/anime?page=1&iPage=1&auth=error&provider=google&error=' + e,
        );
    }

    return redirect('/anime?page=1&iPage=1&auth=success&provider=google');
}
