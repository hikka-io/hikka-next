import config from '@/utils/api/config';

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
}

export default async function req(
    params: Request,
): Promise<{ list: Hikka.Anime[]; pagination: Hikka.Pagination }> {
    const res = await fetch(config.baseAPI + '/anime', {
        method: 'post',
        body: JSON.stringify(params),
        ...config.config,
    });

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            throw await res.json();
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
