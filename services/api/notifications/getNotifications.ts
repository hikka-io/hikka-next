import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Notification> {}

export default async function req({
    page = 1,
    size = 15,
    secret,
}: {
    page?: number;
    size?: number;
    secret?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/notifications`,
        method: 'get',
        page,
        size,
        secret,
    });
}
