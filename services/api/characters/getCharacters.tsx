import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Character> {}

export default async function req({
    query,
    page = 1,
    size = 15,
}: {
    query?: string;
    size?: number;
    page?: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/characters`,
        method: 'post',
        params: { query },
        page,
        size,
    });
}
