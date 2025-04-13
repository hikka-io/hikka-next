import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.User {}

export interface Params {
    username?: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/user/${params?.username}`,
        method: 'get',
    });
}
