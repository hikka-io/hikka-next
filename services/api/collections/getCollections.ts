import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Collection> {}

type Request = {
    secret?: string;
    page?: number;
    size?: number;
};

export default async function req({
    secret,
    page = 1,
    size = 15,
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: `/collections`,
        method: 'get',
        secret,
        page,
        size,
    });
}
