import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.WithPagination<API.Edit> {}

export interface Params {
    page?: number;
    sort?: string[];
    status?: API.EditStatus;
    content_type?: API.ContentType;
    slug?: string;
    author?: string | null;
    moderator?: string | null;
}

export default async function req({
    page = 1,
    size = 15,
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/edit/list`,
        method: 'post',
        params,
        page,
        size,
    });
}
