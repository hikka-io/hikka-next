import config from '@/services/api/config';

export interface Response extends Hikka.Edit {}

export default async function req({
    secret,
    content_type,
    description,
    after,
    slug,
    captcha,
}: {
    secret: string;
    description?: string;
    content_type: Hikka.ContentType;
    after: Hikka.AnimeEditParams;
    slug: string;
    captcha: string;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + '/edit/' + content_type + '/' + slug,
        {
            method: 'put',
            body: JSON.stringify({ after, description }),
            ...config.config,
            headers: {
                ...config.config.headers,
                auth: secret || '',
                Captcha: captcha,
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