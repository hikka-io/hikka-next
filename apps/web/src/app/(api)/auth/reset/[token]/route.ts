import { redirect } from 'next/navigation';

export async function GET(
    request: Request,
    props: { params: Promise<{ token: string }> },
) {
    const params = await props.params;

    const { token } = params;

    return redirect(
        '/anime?page=1&iPage=1&modal=passwordConfirm&token=' + token,
    );
}
