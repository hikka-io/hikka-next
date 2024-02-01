import config from '@/app/_utils/api/config';

export interface Response {
    pagination: Hikka.Pagination;
    list: Hikka.Watch[];
}

export default async function req({
    username,
    status,
    page = 1,
    order = 'score',
    sort = 'desc',
}: {
    username: string;
    status: Hikka.WatchStatus;
    page?: number;
    order?: 'score' | 'episodes' | 'media_type';
    sort?: 'asc' | 'desc';
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI +
            '/watch/' +
            username +
            '/list?' +
            new URLSearchParams({
                status: status,
                page: String(page),
                order: order || '',
                sort: sort || '',
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
