import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.WithPagination<AnimeCharacter> {}

export type AnimeCharacter = {
    main: boolean;
    character: Hikka.Character;
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
    });
}