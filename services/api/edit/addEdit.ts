import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Edit {}

export default async function req({
    auth,
    content_type,
    description,
    after,
    slug,
    auto,
    captcha,
}: {
    auth: string;
    description?: string;
    content_type: API.ContentType;
    after: Hikka.AnimeEditParams;
    slug: string;
    auto?: boolean;
    captcha: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/edit/${content_type}/${slug}`,
        method: 'put',
        params: { after, description, auto },
        auth,
        captcha,
    });
}
