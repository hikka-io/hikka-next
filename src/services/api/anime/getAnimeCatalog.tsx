import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Params {
    query?: string | null;
    sort?: string[];
    years?: string[];
    score?: number[];
    media_type?: string[];
    rating?: string[];
    status?: string[];
    source?: string[];
    season?: string[];
    producers?: string[];
    studios?: string[];
    genres?: string[];
    size?: number;
    only_translated?: boolean;
}

export interface Response extends API.WithPagination<API.Anime> {}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: '/anime',
        method: 'post',
        config: {
            next: {
                revalidate: 3600,
            },
        },
    });
}
