import { fetchRequest } from '@/services/api/fetchRequest';

interface Response {
    reference: string;
    description: string;
    created: number;
    username: string;
    avatar: string;
}

export default async function req({
    secret,
}: {
    secret: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/auth/activation/resend`,
        method: 'post',
        secret,
    });
}