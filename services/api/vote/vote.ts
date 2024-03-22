import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Comment {}

export default async function req({
    secret,
    score,
    slug,
    content_type,
}: {
    secret: string;
    slug: string;
    content_type: API.ContentType;
    score: 0 | -1 | 1;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/vote/${content_type}/${slug}`,
        method: 'put',
        secret,
        params: { score },
    });
}
