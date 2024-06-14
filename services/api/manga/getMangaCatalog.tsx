import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Params {
    years?: string[];
    media_type?: string[];
    status?: string[];
    only_translated?: boolean;
    magazines?: string[];
    genres?: string[];
    score?: string[];
    query?: string | null;
    sort?: string[];
    size?: number;
}

export interface Response extends API.WithPagination<API.Manga> {}

export default async function req(
    props: BaseFetchRequestProps<Params>,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: '/manga',
        method: 'post',
        config: {
            next: {
                revalidate: 3600,
            },
        },
    });
}
