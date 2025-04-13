import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.WithPagination<API.Character> {}

export interface Params {
    query?: string;
}

export default async function req({
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/characters`,
        method: 'post',
        page,
        size,
    });
}
