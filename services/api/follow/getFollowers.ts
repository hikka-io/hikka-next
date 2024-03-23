import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    pagination: API.Pagination;
    list: API.User[];
}

export default async function req({
    username,
    auth,
    page = 1,
    size = 15,
}: {
    username: string;
    auth?: string;
    page?: number;
    size?: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/follow/${username}/followers`,
        method: 'get',
        auth,
        page,
        size,
    });
}