import {
    BaseFetchRequestProps,
    FetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.Anime {}

export interface Params {
    username: string;
    status: API.WatchStatus;
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/watch/random/${params?.username}/${params?.status}`,
        method: 'get',
    });
}
