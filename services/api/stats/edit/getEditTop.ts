import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response
    extends API.WithPagination<{
        user: API.User;
        accepted: number;
        closed: number;
        denied: number;
    }> {}

export default async function req({
    page = 1,
    size = 15,
}: {
    page?: number;
    size?: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/stats/edits/top`,
        method: 'get',
        page,
        size,
    });
}
