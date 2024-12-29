import { redirect } from 'next/navigation';

import loginOAuth from '@/services/api/auth/loginOAuth';
import { setCookie } from '@/utils/cookies';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const baseURL = searchParams.get('state') ? searchParams.get('state') : '/';
    const code = searchParams.get('code');

    try {
        const res = await loginOAuth({
            params: {
                code: String(code),
                provider: 'google',
            },
        });

        await setCookie('auth', res.secret);
    } catch (e) {
        if ('code' in (e as API.Error)) {
            return redirect(
                `${baseURL}?auth=error&provider=google&error=` +
                    (e as API.Error).code,
            );
        }

        return redirect(`${baseURL}?auth=error&provider=google&error=` + e);
    }

    return redirect(`${baseURL}?auth=success&provider=google`);
}
