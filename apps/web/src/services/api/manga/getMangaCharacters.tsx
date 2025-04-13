import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.WithPagination<MangaCharacter> {}

export interface Params {
    slug: string;
}

export type MangaCharacter = {
    main: boolean;
    character: API.Character;
};

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/manga/${params?.slug}/characters`,
        method: 'get',
    });
}
