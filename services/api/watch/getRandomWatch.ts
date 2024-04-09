import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Anime {}

export default async function req({
    username,
    status,
}: {
    username: string;
    status: API.WatchStatus;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/watch/random/${username}/${status}`,
        method: 'get',
    });
}
