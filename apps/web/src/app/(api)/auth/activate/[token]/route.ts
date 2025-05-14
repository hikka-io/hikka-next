import { HikkaClient } from '@hikka/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const client = new HikkaClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

export async function GET(
    request: Request,
    props: { params: Promise<{ token: string }> },
) {
    const params = await props.params;

    const { token } = params;

    try {
        const res = await client.auth.activateUser({ token });
        (await cookies()).set('auth', res.secret);
    } catch (e) {
        if ('code' in (e as any)) {
            if ((e as any).code === 'auth-modal:activation_expired') {
                return redirect('/anime?activation=resend');
            }

            return redirect(
                '/anime?page=1&activation=error&error=' + (e as any).code,
            );
        }

        return redirect('/anime?page=1&activation=error&error=' + e);
    }

    return redirect('/anime?page=1&activation=success');
}
