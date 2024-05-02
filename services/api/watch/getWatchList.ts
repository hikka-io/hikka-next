import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Watch> {}

export interface Params {
    sort?: string[];
    years?: string[];
    score?: string[];
    media_type?: string[];
    rating?: string[];
    status?: string[];
    source?: string[];
    season?: string[];
    producers?: string[];
    studios?: string[];
    genres?: string[];
    username: string;
    watch_status: API.WatchStatus;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    const { username, ...restParams } = params!;

    return fetchRequest<Response>({
        ...props,
        path: `/watch/${username}/list`,
        method: 'post',
        params: restParams,
    });
}
