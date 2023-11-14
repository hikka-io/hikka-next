import config from '@/utils/api/config';

export interface Response {
    pagination: Hikka.Pagination;
    list: {
        reference: string;
        updated: number;
        created: number;
        note: string;
        status: Hikka.WatchStatus;
        episodes: number;
        score: number;
        anime: Hikka.Anime;
    }[];
}

export default async function req({
    username,
    status,
}: {
    username: string;
    status: Hikka.WatchStatus;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI +
            '/watch/' +
            username +
            '/list?' +
            new URLSearchParams({
                status: status,
            }),
        {
            method: 'get',
            ...config.config,
        },
    );

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
