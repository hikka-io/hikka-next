import { fetchRequest } from '@/services/api/fetchRequest';

export default async function req({
    username,
}: {
    username: string;
}): Promise<Record<API.WatchStatus | 'duration', number>> {
    return fetchRequest<Record<API.WatchStatus | 'duration', number>>({
        path: `/watch/${username}/stats`,
        method: 'get',
    });
}
