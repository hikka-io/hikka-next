import { Value } from '@udecode/plate';

import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Article {}

export interface Params {
    slug: string;
    document: Value;
    title: string;
    tags: string[];
    content?: {
        slug: string;
        content_type: API.ContentType;
    };
    draft?: boolean;
    category: API.ArticleCategory;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        params: {
            document: params?.document,
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
