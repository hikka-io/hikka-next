import config from '@/services/api/config';
import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    pagination: Hikka.Pagination;
    list: Hikka.Watch[];
}

export default async function req({
    username,
    status,
    page = 1,
    size = 15,
    order = 'score',
    sort = 'desc',
}: {
    username: string;
    status: Hikka.WatchStatus;
    page?: number;
    size?: number;
    order?: 'score' | 'episodes' | 'media_type';
    sort?: 'asc' | 'desc';
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/watch/${username}/list`,
        method: 'get',
        params: { status, order: order || '', sort: sort || '' },
        page,
        size,
    });
}
