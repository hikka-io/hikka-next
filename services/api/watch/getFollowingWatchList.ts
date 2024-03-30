import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response
    extends API.WithPagination<
        {
            watch: API.Watch[];
        } & API.User
    > {}

export interface Request {
    page?: number;
    size?: number;
    slug: string;
    auth: string;
}

export default async function req({
    slug,
    page = 1,
    size = 15,
    auth,
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: `/watch/${slug}/following`,
        method: 'get',
        page,
        size,
        auth,
    });
}
