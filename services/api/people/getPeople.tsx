import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Person> {}

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
        path: `/people`,
        method: 'post',
        params: { query },
        page,
        size,
    });
}
