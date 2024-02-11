import { fetchRequest } from '@/services/api/fetchRequest';

interface Response extends Hikka.User {}

export default async function req(params: {
    email: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/auth/password/reset`,
        method: 'post',
        params,
    });
}