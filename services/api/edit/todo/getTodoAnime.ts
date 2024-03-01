import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Anime> {}

export default async function req({
    param,
    secret,
    page = 1,
    size = 15,
}: {
    param: string;
    secret?: string;
    page?: number;
    size?: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/edit/todo/anime/${param}`,
        method: 'get',
        secret,
        page,
        size,
    });
}