import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Comment {}

export default async function req({
    auth,
    slug,
    content_type,
    text,
    parent,
}: {
    auth: string;
    slug: string;
    content_type: API.ContentType;
    text: string;
    parent?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/comments/${content_type}/${slug}`,
        method: 'put',
        params: { text, parent },
        auth,
    });
}
