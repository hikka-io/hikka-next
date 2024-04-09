import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.Person {}

export default async function req({
    slug,
}: {
    slug: string;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/people/${slug}`,
        method: 'get',
        config: {
            next: {
                revalidate: 60,
            },
        },
    });
}
