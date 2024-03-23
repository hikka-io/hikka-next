import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Comment {}

export default async function req({
    auth,
    score,
    slug,
    content_type,
}: {
    auth: string;
    slug: string;
    content_type: API.ContentType;
    score: 0 | -1 | 1;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/vote/${content_type}/${slug}`,
        method: 'put',
        auth,
        params: { score },
    });
}
