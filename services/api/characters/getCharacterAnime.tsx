import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<Anime> {}

export type Anime = {
    main: boolean;
    anime: API.Anime;
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
        path: `/characters/${params?.slug}/anime`,
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
