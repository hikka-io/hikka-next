import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<PersonCharacter> {}

type PersonCharacter = {
    character: API.Character;
    anime: API.AnimeInfo;
    language: string;
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
        path: `/people/${slug}/characters`,
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
