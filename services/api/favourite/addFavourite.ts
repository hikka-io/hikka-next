import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    reference: string;
    created: number;
    anime: Hikka.Anime;
}

export default async function req({
    secret,
    slug,
}: {
    secret: string;
    slug: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/favourite/anime/${slug}`,
        method: 'put',
        secret,
    });
}