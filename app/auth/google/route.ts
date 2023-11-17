import loginOAuth from '@/utils/api/auth/loginOAuth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import {NextResponse} from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const res = await loginOAuth({
            code: String(code),
            provider: 'google',
        });

        cookies().set('secret', res.secret);

        return NextResponse.json({ res });

        // return redirect('/anime?auth=success&provider=google');
    } catch (e) {
        return NextResponse.json({ e });
    }
}
