import { redirect } from 'next/navigation';

export async function GET(
    request: Request,
    { params: { token } }: { params: { token: string } },
) {
    console.log(token);
    return redirect('/anime?page=1&iPage=1&modal=passwordConfirm&token=' + token);
}
