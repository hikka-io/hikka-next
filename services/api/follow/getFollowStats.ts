import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    followers: number;
    following: number;
}

export default async function req({
    username,
}: {
    username: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/follow/${username}/stats`,
        method: 'get',
    });
}
