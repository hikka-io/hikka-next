import { fetchRequest } from '@/services/api/fetchRequest';

interface Request {
    query?: string | null;
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
    secret?: string;
    size?: number;
    only_translated?: boolean;
}

export interface Response {
    list: Hikka.Anime[];
    pagination: Hikka.Pagination;
}

export default async function req({
    page = 1,
    size = 15,
    secret,
    ...params
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: '/anime',
        method: 'post',
        params,
        page,
        size,
        secret,
    });
}