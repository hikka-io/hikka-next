import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<PersonAnime> {}

type PersonAnime = {
    roles: {
        name_en: string;
        name_ua: string;
    }[];
    anime: API.AnimeInfo;
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
        path: `/people/${slug}/anime`,
        method: 'get',
        page,
        size,
        config: {
            next: {
                revalidate: 60,
            },
        },
    });
}
