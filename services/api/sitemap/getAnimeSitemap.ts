import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response {
    updated_at: number;
    slug: string;
}

export default async function req(
    props?: BaseFetchRequestProps,
): Promise<Response[]> {
    return fetchRequest<Response[]>({
        ...props,
        path: `/sitemap/sitemap_anime.json`,
        method: 'get',
        config: {
            next: {
                revalidate: false,
            },
        },
    });
}
