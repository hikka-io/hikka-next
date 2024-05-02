import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<PersonCharacter> {}

type PersonCharacter = {
    character: API.Character;
    anime: API.AnimeInfo;
    language: string;
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
        path: `/people/${params?.slug}/characters`,
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
