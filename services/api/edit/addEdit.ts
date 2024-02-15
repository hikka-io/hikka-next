import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.Edit {}

export default async function req({
    secret,
    content_type,
    description,
    after,
    slug,
    auto,
    captcha,
}: {
    secret: string;
    description?: string;
    content_type: Hikka.ContentType;
    after: Hikka.AnimeEditParams;
    slug: string;
    auto?: boolean;
    captcha: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/edit/${content_type}/${slug}`,
        method: 'put',
        params: { after, description, auto },
        secret,
        captcha,
    });
}
