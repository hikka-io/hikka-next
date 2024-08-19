import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response
    extends API.WithPagination<
        {
            read: API.Read[];
        } & API.User
    > {}

export interface Params {
    slug: string;
    content_type: 'manga' | 'novel';
}

export default async function req({
    params,
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/read/${params?.content_type}/${params?.slug}/following`,
        method: 'get',
        page,
        size,
    });
}
