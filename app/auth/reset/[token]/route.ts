import { redirect } from 'next/navigation';

export async function GET(
    request: Request,
    { params: { token } }: { params: { token: string } },
) {
    return redirect('/anime?modal=passwordConfirm&token=' + token);
}
