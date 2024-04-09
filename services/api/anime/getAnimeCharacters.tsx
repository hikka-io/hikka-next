import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<AnimeCharacter> {}

export type AnimeCharacter = {
    main: boolean;
    character: API.Character;
};

export default async function req({
    slug,
    page = 1,
    size = 15,
}: {
    slug: string;
    page?: number;
    size?: number;
}): Promise<Response> {
    return fetchRequest<Response>({
        path: `/anime/${slug}/characters`,
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
