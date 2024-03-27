import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Collection> {}

type Request = {
    auth?: string;
    content_type?: string;
    author?: string;
    sort: 'system_ranking' | 'created';
    page?: number;
    size?: number;
};

export default async function req({
    auth,
    page = 1,
    size = 15,
    content_type,
    author,
    sort,
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: `/collections`,
        method: 'post',
        params: {
            content_type,
            author,
            sort: [`${sort}:desc`],
        },
        auth,
        page,
        size,
    });
}
