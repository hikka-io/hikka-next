import config from '@/app/_utils/api/config';

export interface Response extends Hikka.Comment {}

export default async function req({
    secret,
    slug,
    content_type,
    text,
    parent,
}: {
    secret: string;
    slug: string;
    content_type: Hikka.ContentType;
    text: string;
    parent?: string;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + `/comments/${content_type}/${slug}`,
        {
            method: 'put',
            body: JSON.stringify({ text, parent }),
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