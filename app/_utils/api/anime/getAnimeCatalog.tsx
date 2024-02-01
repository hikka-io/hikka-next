import config from '@/app/_utils/api/config';


interface Request {
    query?: string;
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
    const res = await fetch(
        config.baseAPI + '/anime?page=' + page + '&size=' + size,
        {
            method: 'post',
            body: JSON.stringify(params),
            ...config.config,
            headers: {
                ...config.config.headers,
                auth: secret || '',
            },
        },
    );

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            throw await res.json();
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}