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

export interface Params {}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/articles/stats`,
        method: 'get',
    });
}
