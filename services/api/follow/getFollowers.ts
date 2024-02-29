import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    pagination: API.Pagination;
    list: API.User[];
}

export default async function req({
    username,
    secret,
    page = 1,
    size = 15,
}: {
    username: string;
    secret?: string;
    page?: number;
    size?: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/follow/${username}/followers`,
        method: 'get',
        secret,
        page,
        size,
    });
}