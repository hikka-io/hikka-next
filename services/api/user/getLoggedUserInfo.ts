import { fetchRequest } from '@/services/api/fetchRequest';

interface Response extends API.User {}

export default async function req({
    secret,
}: {
    secret?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/user/me`,
        method: 'get',
        secret: secret,
    });
}