import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.AnimeInfo {}

export interface Params {
    slug: string;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/anime/${params?.slug}`,
        method: 'get',
        config: {
            next: {
                revalidate: 60,
            },
        },
    });
}
