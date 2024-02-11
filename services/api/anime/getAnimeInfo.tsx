import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.AnimeInfo {}

export default async function req({
    slug,
}: {
    slug: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/anime/${slug}`,
        method: 'get',
    });
}