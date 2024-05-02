import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Notification> {}

export default async function req({
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/notifications`,
        method: 'get',
        page,
        size,
    });
}
