import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Collection> {}

type Request = {
    auth?: string;
    username: string;
    page?: number;
    size?: number;
};

export default async function req({
    auth,
    username,
    page = 1,
    size = 15,
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: `/collections/user/${username}`,
        method: 'get',
        auth,
        page,
        size,
    });
}
