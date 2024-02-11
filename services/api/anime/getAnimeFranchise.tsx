import config from '@/services/api/config';
import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.WithPagination<Hikka.Anime> {}

export default async function req({
    slug,
    page = 1,
    size = 15,
    secret,
}: {
    slug: string;
    page?: number;
    size?: number;
    secret?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/anime/${slug}/franchise`,
        method: 'get',
        page,
        size,
        secret
    });
}
