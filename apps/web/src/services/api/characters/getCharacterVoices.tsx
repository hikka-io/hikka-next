import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.WithPagination<PersonCharacter> {}

type PersonCharacter = {
    person: API.Person;
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
        path: `/characters/${params?.slug}/voices`,
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
