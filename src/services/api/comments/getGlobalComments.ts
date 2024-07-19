import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export default async function req({
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps): Promise<API.WithPagination<API.Comment>> {
    return fetchRequest<API.WithPagination<API.Comment>>({
        ...props,
        path: `/comments/list`,
        method: 'get',
        page,
        size,
    });
}
