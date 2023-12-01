import config from '@/utils/api/config';

export interface Response {
    pagination: Hikka.Pagination;
    list: Hikka.Anime[];
}

export default async function req({
    slug,
    page = 1,
    secret
}: {
    slug: string;
    page?: number;
    secret?: string;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI +
            `/anime/${slug}/franchise?` +
            new URLSearchParams({
                page: String(page),
            }),
        {
            method: 'get',
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
