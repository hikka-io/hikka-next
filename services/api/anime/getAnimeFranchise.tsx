import config from '@/services/api/config';
import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Anime> {}

export default async function req({
    slug,
    page = 1,
    size = 15,
    auth,
}: {
    slug: string;
    page?: number;
    size?: number;
    auth?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/anime/${slug}/franchise`,
        method: 'get',
        page,
        size,
        auth
    });
}
