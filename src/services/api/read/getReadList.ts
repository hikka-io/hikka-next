import {
    BaseFetchRequestProps,
    fetchRequest,
} from '@/services/api/fetchRequest';

export interface Response extends API.WithPagination<API.Read> {}

export interface Params {
    years?: string[];
    media_type?: string[];
    status?: string[];
    only_translated?: boolean;
    magazines?: string[];
    genres?: string[];
    score?: string[];
    sort?: string[];
    read_status: API.ReadStatus;
    username: string;
    content_type: 'manga' | 'novel';
}

export default async function req({
    params,
    ...props
}: BaseFetchRequestProps<Params>): Promise<Response> {
    const { username, content_type, ...restParams } = params!;

    return fetchRequest<Response>({
        ...props,
        path: `/read/${content_type}/${username}/list`,
        method: 'post',
        params: restParams,
    });
}
