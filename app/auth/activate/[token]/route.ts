import activation from '@/utils/api/auth/activation';
import { redirect } from 'next/navigation';

export async function GET(
    request: Request,
    { params: { token } }: { params: { token: string } },
) {
    try {
        const res = await activation({ token });
        return redirect('/anime?activation=success&username=' + res.username);
    } catch (e) {
        if ('code' in (e as Hikka.Error)) {
            if ((e as Hikka.Error).code === 'auth:activation_expired') {
                return redirect('/anime?activation=resend');
            }
        }

        return redirect('/anime?activation=error');
    }
}
