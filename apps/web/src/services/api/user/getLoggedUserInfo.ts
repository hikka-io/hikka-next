import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

interface Response extends API.User {}

export default async function req(
    props?: BaseFetchRequestProps,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/user/me`,
        method: 'get',
    });
}
