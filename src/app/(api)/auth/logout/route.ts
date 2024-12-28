import { cookies } from 'next/headers';

export async function GET() {
    (await cookies()).delete('token');

    return Response.redirect(`${process.env.SITE_URL}`);
}
