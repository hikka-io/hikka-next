import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response {
    list: API.Comment[];
    pagination: API.Pagination;
}

export interface Params {
    slug: string;
    content_type: API.ContentType;
}

export default async function req({
    page = 1,
    size = 15,
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/comments/${params?.content_type}/${params?.slug}/list`,
        method: 'get',
        page,
        size,
    });
}
