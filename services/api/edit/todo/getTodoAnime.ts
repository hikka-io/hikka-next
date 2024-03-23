import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Anime> {}

export default async function req({
    param,
    auth,
    page = 1,
    size = 15,
}: {
    param: string;
    auth?: string;
    page?: number;
    size?: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/edit/todo/anime/${param}`,
        method: 'get',
        auth,
        page,
        size,
    });
}