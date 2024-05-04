import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.History> {}

export default async function req({
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/history/following`,
        method: 'get',
        page: page,
        size: size,
    });
}
