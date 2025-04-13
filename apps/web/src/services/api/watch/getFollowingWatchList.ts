import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response
    extends API.WithPagination<
        {
            watch: API.Watch[];
        } & API.User
    > {}

export interface Params {
    slug: string;
}

export default async function req({
    params,
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/watch/${params?.slug}/following`,
        method: 'get',
        page,
        size,
    });
}
