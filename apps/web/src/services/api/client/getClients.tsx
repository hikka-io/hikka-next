import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.WithPagination<API.Client> {}

export default async function req(
    props?: BaseFetchRequestProps,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/client`,
        method: 'get',
    });
}
