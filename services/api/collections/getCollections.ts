import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response
    extends API.WithPagination<API.Collection<API.MainContent>> {}

export interface Params {
    content_type?: string;
    author?: string;
    sort: 'system_ranking' | 'created';
    only_public?: boolean;
    page?: number;
    size?: number;
}

export default async function req({
    page = 1,
    size = 15,
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/collections`,
        method: 'post',
        params: {
            content_type: params?.content_type,
            author: params?.author,
            sort: [`${params?.sort}:desc`],
            only_public: params?.only_public,
        },
        page,
        size,
    });
}
