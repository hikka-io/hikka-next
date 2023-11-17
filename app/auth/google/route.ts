import loginOAuth from '@/utils/api/auth/loginOAuth';
import { redirect } from 'next/navigation';
// import { setCookie } from '@/app/actions';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const res = await loginOAuth({
            code: String(code),
            provider: 'google',
        });

        // await setCookie('secret', res.secret);

        return redirect('/anime?auth=success&provider=google');
    } catch (e) {
        return redirect('/anime?auth=error&provider=google');
    }
}
