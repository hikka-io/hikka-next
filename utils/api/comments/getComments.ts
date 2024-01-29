import config from '@/utils/api/config';

export interface Response {
    list: Hikka.Comment[];
    pagination: Hikka.Pagination;
}

export default async function req({
    slug,
    content_type,
    secret,
    page = 1,
}: {
    slug: string;
    content_type: Hikka.ContentType;
    page?: number;
    secret?: string;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + `/comments/${content_type}/${slug}/list?page=` + page,
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