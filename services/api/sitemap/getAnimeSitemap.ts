import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    updated_at: number;
    slug: string;
}

export default async function req(): Promise<Response[]> {
    return fetchRequest<Response[]>({
        path: `/sitemap/sitemap_anime.json`,
        method: 'get',
        config: {
            next: {
                revalidate: false,
            },
        },
    });
}
