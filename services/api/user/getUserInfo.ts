import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.User {}

export default async function req({
    username,
}: {
    username: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/user/${username}`,
        method: 'get',
    });
}