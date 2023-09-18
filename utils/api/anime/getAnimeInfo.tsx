import config from '@/utils/api/config';

interface Response {
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
    external: {
        url: string;
        text: string;
    }[];
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
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
