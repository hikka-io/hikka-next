import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Article> {}

export interface Params {
    categories?: API.ArticleCategory[];
    page?: number;
    size?: number;
    sort?: string[];
    author?: string;
    draft?: boolean;
    tags?: string[];
    content_type?: API.ContentType;
    content_slug?: string;
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
            content_type: params?.content_type,
            content_slug: params?.content_slug,
            categories: params?.categories,
        },
        page: params?.page,
        size: params?.size,
        ...props,
        path: `/articles`,
        method: 'post',
    });
}
