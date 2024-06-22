import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<NovelCharacter> {}

export interface Params {
    slug: string;
}

export type NovelCharacter = {
    main: boolean;
    character: API.Character;
};

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/novel/${params?.slug}/characters`,
        method: 'get',
    });
}
