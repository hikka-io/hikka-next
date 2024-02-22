import { fetchRequest } from '@/services/api/fetchRequest';

export default async function req({
    username,
}: {
    username: string;
}): Promise<Hikka.Activity[]> {
    return fetchRequest<Hikka.Activity[]>({
        path: `/user/${username}/activity`,
        method: 'get',
    });
}
