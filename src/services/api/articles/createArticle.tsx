import { Value } from '@udecode/plate';

import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Article {}

export interface Params {
    document: Value;
    title: string;
    tags: string[];
    content?: {
        slug: string;
        content_type: API.ContentType;
    };
    draft?: boolean;
    cover?: string;
    category: API.ArticleCategory;
}

export default async function req({
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/articles/create`,
        method: 'post',
    });
}
