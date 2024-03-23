import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Notification> {}

export default async function req({
    page = 1,
    size = 15,
    auth,
}: {
    page?: number;
    size?: number;
    auth?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/notifications`,
        method: 'get',
        page,
        size,
        auth,
    });
}
