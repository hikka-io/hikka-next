import { BaseFetchRequestProps, fetchRequest } from '../fetchRequest';

export interface Response extends API.WithPagination<PersonManga> {}

export type PersonManga = {
    roles: {
        name_en: string;
        name_ua: string;
    }[];
    manga: API.MangaInfo;
};

export interface Params {
    slug: string;
    size?: number;
}

export default async function req({
    params,
    page = 1,
    size = 15,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/people/${params?.slug}/manga`,
        method: 'get',
        page,
        size,
    });
}
