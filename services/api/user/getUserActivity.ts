import { fetchRequest } from '@/services/api/fetchRequest';

export default async function req({
    username,
}: {
    username: string;
}): Promise<API.Activity[]> {
    return fetchRequest<API.Activity[]>({
        path: `/user/${username}/activity`,
        method: 'get',
    });
}
