import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.Character {}

export default async function req({
    slug,
}: {
    slug: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/characters/${slug}`,
        method: 'get',
    });
}