import { fetchRequest } from '@/services/api/fetchRequest';

interface Response extends API.User {}

export default async function req({
    auth,
}: {
    auth?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/user/me`,
        method: 'get',
        auth: auth,
    });
}