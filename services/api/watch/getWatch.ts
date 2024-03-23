import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Watch {}

export default async function req({
    slug,
    auth,
}: {
    slug: string;
    auth: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/watch/${slug}`,
        method: 'get',
        auth,
    });
}