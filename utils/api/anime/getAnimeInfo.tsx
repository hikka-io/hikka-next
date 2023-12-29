import config from '@/utils/api/config';

export interface Response {
    companies: Hikka.Company[];
    genres: Hikka.Genre[];
    start_date: number;
    end_date: number;
    episodes_released: number;
    episodes_total: number;
    synopsis_en: string;
    synopsis_ua: string;
    media_type: Hikka.MediaType;
    title_ua: string;
    title_en: string;
    title_ja: string;
    duration: number;
    poster: string;
    status: Hikka.Status;
    source: Hikka.Source;
    rating: Hikka.AgeRating;
    has_franchise: boolean;
    scored_by: number;
    score: number;
    nsfw: boolean;
    slug: string;
    synonyms: string[];
    external: Hikka.External[];
    videos: Hikka.Video[];
    ost: Hikka.OST[];
    stats: Hikka.Stats;
}

export default async function req({
    slug,
}: {
    slug: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/anime/' + slug, {
        method: 'get',
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