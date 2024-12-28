import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response {
    authors: {
        user: API.User;
        reviews: number;
        news: number;
    }[];
    tags: API.Tag[];
}

export interface Params {
    category: API.ArticleCategory;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/articles/top/${params?.category}`,
        method: 'get',
    });
}
