import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Collection> {}

type Request = {
    auth?: string;
    page?: number;
    size?: number;
};

export default async function req({
    auth,
    page = 1,
    size = 15,
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: `/collections`,
        method: 'get',
        auth,
        page,
        size,
    });
}
