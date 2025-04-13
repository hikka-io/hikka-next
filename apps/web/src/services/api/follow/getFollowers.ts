import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    pagination: API.Pagination;
    list: API.User[];
}

export interface Params {
    username: string;
}

export default async function req({
    params,
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/follow/${params?.username}/followers`,
        method: 'get',
        page,
        size,
    });
}
