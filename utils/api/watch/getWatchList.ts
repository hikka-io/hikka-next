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
    page = 1,
}: {
    username: string;
    status: Hikka.WatchStatus;
    page?: number;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI +
            '/watch/' +
            username +
            '/list?' +
            new URLSearchParams({
                status: status,
                page: String(page),
            }),
        {
            method: 'get',
            ...config.config,
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
