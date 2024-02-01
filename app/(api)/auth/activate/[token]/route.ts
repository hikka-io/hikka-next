import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import activation from '@/app/_utils/api/auth/activation';

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params: { token } }: { params: { token: string } },
) {
    try {
        const res = await activation({ token });
        cookies().set('secret', res.secret);
    } catch (e) {
        if ('code' in (e as Hikka.Error)) {
            if ((e as Hikka.Error).code === 'auth-modal:activation_expired') {
                return redirect('/anime?activation=resend');
            }

            return redirect(
                '/anime?page=1&iPage=1&activation=error&error=' + (e as Hikka.Error).code,
            );
        }

        return redirect('/anime?page=1&iPage=1&activation=error&error=' + e);
    }

    return redirect('/anime?page=1&iPage=1&activation=success');
}
