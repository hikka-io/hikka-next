import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export default async function req(
    props?: BaseFetchRequestProps,
): Promise<API.GlobalComment[]> {
    return fetchRequest<API.GlobalComment[]>({
        ...props,
        path: `/comments/latest`,
        method: 'get',
    });
}
