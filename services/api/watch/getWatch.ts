import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.Watch {}

export default async function req({
    slug,
    secret,
}: {
    slug: string;
    secret: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/watch/${slug}`,
        method: 'get',
        secret,
    });
}