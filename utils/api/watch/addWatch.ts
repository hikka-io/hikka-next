import config from '@/utils/api/config';

export interface Response {
    note: string;
    score: number;
    episodes: number;
    status: Hikka.WatchStatus;
}

export default async function req({
    secret,
    slug,
    note,
    status,
    score,
    episodes,
}: {
    secret: string;
    slug: string;
    note?: string;
    score?: number;
    episodes?: number;
    status: Hikka.WatchStatus;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/watch/' + slug, {
        method: 'put',
        body: JSON.stringify({ note, score, episodes, status }),
        ...config.config,
        headers: {
            ...config.config.headers,
            auth: secret || '',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
