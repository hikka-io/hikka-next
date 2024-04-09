import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.AnimeInfo {}

export default async function req({
    slug,
}: {
    slug: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/anime/${slug}`,
        method: 'get',
        config: {
            next: {
                revalidate: 60,
            },
        },
    });
}
