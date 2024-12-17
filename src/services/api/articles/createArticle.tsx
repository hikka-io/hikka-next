import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Article {}

export interface Params {
    text: string;
    title: string;
    tags: string[];
    content?: API.MainContent;
    draft?: boolean;
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
