import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Article> {}

export interface Params {
    category: API.ArticleCategory;
    page?: number;
    size?: number;
    sort?: string[];
    author?: string;
    draft?: boolean;
    tags?: string[];
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        params: {
            author: params?.author,
            draft: params?.draft,
            sort: params?.sort,
            tags: params?.tags,
        },
        page: params?.page,
        size: params?.size,
        ...props,
        path: `/articles/${params?.category}`,
        method: 'post',
    });
}
