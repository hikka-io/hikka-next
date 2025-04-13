import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.WithPagination<PersonWithRoles> {}

type PersonWithRoles = {
    person: API.Person;
    roles: {
        name_ua: string;
        name_en: string;
        slug: string;
    }[];
};

export interface Params {
    slug: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/anime/${params?.slug}/staff`,
        method: 'get',
        config: {
            next: {
                revalidate: 60,
            },
        },
    });
}
