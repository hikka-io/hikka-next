import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.WithPagination<AnimeCharacter> {}

export interface Params {
    slug: string;
}

export type AnimeCharacter = {
    main: boolean;
    character: API.Character;
};

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/anime/${params?.slug}/characters`,
        method: 'get',
    });
}
