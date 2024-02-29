import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Edit> {}

export default async function req({
    page = 1,
    size = 15,
}: {
    page?: number;
    size?: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/edit/list`,
        method: 'get',
        page,
        size,
    });
}