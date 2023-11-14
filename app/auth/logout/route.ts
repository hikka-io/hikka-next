import { cookies } from 'next/headers';

export async function GET() {
    cookies().delete('secret');

    return Response.json({ result: true });
}
