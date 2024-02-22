import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.WithPagination<Hikka.History> {}

export default async function req({
    page = 1,
    size = 15,
    username,
}: {
    page?: number;
    size?: number;
    username: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/user/${username}/history`,
        method: 'get',
        page: page,
        size: size,
    });
}