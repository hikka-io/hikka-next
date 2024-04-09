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
    auth?: string;
    size?: number;
    only_translated?: boolean;
}

export interface Response extends API.WithPagination<API.Anime> {}

export default async function req({
    page = 1,
    size = 15,
    auth,
    query,
    ...params
}: Request): Promise<Response> {
    return fetchRequest<Response>({
        path: '/anime',
        method: 'post',
        params: {
            ...params,
            ...(query && query.length > 2 ? { query } : {}),
        },
        page,
        size,
        auth,
        config: {
            next: {
                revalidate: 3600,
            },
        },
    });
}
