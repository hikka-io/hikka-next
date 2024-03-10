import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    reference: string;
    created: number;
    anime: API.Anime;
}

export default async function req({
    slug,
    secret,
    content_type,
}: {
    slug: string;
    secret: string;
    content_type: API.ContentType;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/favourite/${content_type}/${slug}`,
        method: 'get',
        secret,
    });
}