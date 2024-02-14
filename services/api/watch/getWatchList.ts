import { fetchRequest } from '@/services/api/fetchRequest';

export interface Response extends Hikka.WithPagination<Hikka.Watch> {}

export interface Request {
    sort?: string[];
    page?: number;
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
    size?: number;
    username: string;
    watch_status: Hikka.WatchStatus;
}


export default async function req({
    username,
    page = 1,
    size = 15,
    ...params
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: `/watch/${username}/list`,
        method: 'post',
        params: params,
        page,
        size,
    });
}
