import config from '@/services/api/config';

export interface Response {
    pagination: Hikka.Pagination;
    list: {
        person: Hikka.Person;
        roles: {
            name_ua: string;
            name_en: string;
            slug: string;
        }[];
    }[];
}

export default async function req({
    slug,
    page = 1,
}: {
    slug: string;
    page?: number;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI +
            `/anime/${slug}/staff?` +
            new URLSearchParams({
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
