import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export default async function req(
    props?: BaseFetchRequestProps,
): Promise<API.Comment[]> {
    return fetchRequest<API.Comment[]>({
        ...props,
        path: `/comments/latest/new`,
        method: 'get',
    });
}
