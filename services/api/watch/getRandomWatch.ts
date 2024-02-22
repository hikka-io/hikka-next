import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.Anime {}

export default async function req({
    username,
    status,
}: {
    username: string;
    status: Hikka.WatchStatus;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/watch/random/${username}/${status}`,
        method: 'get',
    });
}