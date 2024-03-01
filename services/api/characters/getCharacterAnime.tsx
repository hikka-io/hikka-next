import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<Anime> {}

export type Anime = {
    main: boolean;
    anime: API.Anime;
};

export default async function req({
    slug,
    page = 1,
    size = 15,
}: {
    slug: string;
    size?: number;
    page?: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/characters/${slug}/anime`,
        method: 'get',
        page,
        size,
    });
}