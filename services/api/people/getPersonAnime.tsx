import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<PersonAnime> {}

type PersonAnime = {
    roles: {
        name_en: string;
        name_ua: string;
    }[];
    anime: API.AnimeInfo;
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
        path: `/people/${params?.slug}/anime`,
        method: 'get',
        page,
        size,
    });
}
