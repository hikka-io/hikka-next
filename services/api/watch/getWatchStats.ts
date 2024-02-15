import { fetchRequest } from '@/services/api/fetchRequest';

export default async function req({
    username,
}: {
    username: string;
}): Promise<Record<Hikka.WatchStatus | 'duration', number>> {
    return fetchRequest<Record<Hikka.WatchStatus | 'duration', number>>({
        path: `/watch/${username}/stats`,
        method: 'get',
    });
}