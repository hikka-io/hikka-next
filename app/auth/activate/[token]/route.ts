import activation from '@/utils/api/auth/activation';
import { redirect } from 'next/navigation';
import {cookies} from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params: { token } }: { params: { token: string } },
) {
    try {
        const res = await activation({ token });
        cookies().set('secret', res.secret);
    }  catch (e) {
        if ('code' in (e as Hikka.Error)) {
            if ((e as Hikka.Error).code === 'auth:activation_expired') {
                return redirect('/anime?activation=resend');
            }

            return redirect('/anime?activation=error&error=' + (e as Hikka.Error).code);
        }

        return redirect('/anime?activation=error&error=' + e);
    }

    return redirect('/anime?activation=success');
}
