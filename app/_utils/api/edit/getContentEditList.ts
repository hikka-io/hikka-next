import config from '@/app/_utils/api/config';

export interface Response extends Hikka.WithPagination<Hikka.Edit> {}

export default async function req({
    content_type,
    slug,
    page = 1,
}: {
    content_type: Hikka.ContentType;
    slug: string;
    page?: number;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI +
            '/edit/' +
            content_type +
            '/' +
            slug +
            '/list?page=' +
            page,
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