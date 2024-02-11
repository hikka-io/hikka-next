import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.Comment {}

export default async function req({
    secret,
    slug,
    content_type,
    text,
    parent,
}: {
    secret: string;
    slug: string;
    content_type: Hikka.ContentType;
    text: string;
    parent?: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/comments/${content_type}/${slug}`,
        method: 'put',
        params: { text, parent },
        secret,
    });
}