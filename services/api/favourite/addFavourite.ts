import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    reference: string;
    created: number;
}

export default async function req({
    secret,
    slug,
    content_type,
}: {
    secret: string;
    slug: string;
    content_type: API.ContentType;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/favourite/${content_type}/${slug}`,
        method: 'put',
        secret,
    });
}
