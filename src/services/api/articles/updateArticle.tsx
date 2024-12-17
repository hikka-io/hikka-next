import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Article {}

export interface Params {
    slug: string;
    text: string;
    title: string;
    tags: string[];
    content?: API.MainContent;
    draft?: boolean;
    category: API.ArticleCategory;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        params: {
            text: params?.text,
            title: params?.title,
            tags: params?.tags,
            content: params?.content,
            draft: params?.draft,
            category: params?.category,
        },
        ...props,
        path: `/articles/${params?.slug}`,
        method: 'put',
    });
}
