import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export default async function req(
    props?: BaseFetchRequestProps,
): Promise<API.Comment[]> {
    return fetchRequest<API.Comment[]>({
        ...props,
        path: `/comments/latest`,
        method: 'get',
    });
}
