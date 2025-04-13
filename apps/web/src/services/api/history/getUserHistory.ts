import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.WithPagination<API.History> {}

export interface Params {
    username: string;
}

export default async function req({
    page = 1,
    size = 15,
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/history/user/${params?.username}`,
        method: 'get',
        page: page,
        size: size,
    });
}
