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

    return await res.json();
}
