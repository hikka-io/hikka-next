import { cookies } from 'next/headers';

export async function GET() {
    cookies().delete('auth');

    return Response.redirect(`${process.env.SITE_URL}`);
}
