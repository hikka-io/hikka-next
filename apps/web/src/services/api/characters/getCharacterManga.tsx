import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.WithPagination<CharacterManga> {}

export type CharacterManga = {
    main: boolean;
    manga: API.Manga;
};

export interface Params {
    slug: string;
}

export default async function req({
    params,
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/characters/${params?.slug}/manga`,
        method: 'get',
        page,
        size,
    });
}
