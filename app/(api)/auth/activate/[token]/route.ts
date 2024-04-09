import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import activation from '@/services/api/auth/activation';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params: { token } }: { params: { token: string } },
) {
    try {
        const res = await activation({ token });
        cookies().set('auth', res.secret);
    } catch (e) {
        if ('code' in (e as API.Error)) {
            if ((e as API.Error).code === 'auth-modal:activation_expired') {
                return redirect('/anime?activation=resend');
            }

            return redirect(
                '/anime?page=1&iPage=1&activation=error&error=' +
                    (e as API.Error).code,
            );
        }

        return redirect('/anime?page=1&iPage=1&activation=error&error=' + e);
    }

    return redirect('/anime?page=1&iPage=1&activation=success');
}
