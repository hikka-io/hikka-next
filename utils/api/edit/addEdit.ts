import config from '@/utils/api/config';

export interface Response extends Hikka.Edit {}

export default async function req({
    secret,
    contentType,
    description,
    after,
    slug,
    captcha
}: {
    secret: string;
    description?: string;
    contentType: 'anime' | 'person';
    after: Hikka.EditParams;
    slug: string;
    captcha: string;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + '/edit/' + contentType + '/' + slug,
        {
            method: 'put',
            body: JSON.stringify({ after, description }),
            ...config.config,
            headers: {
                ...config.config.headers,
                auth: secret || '',
                "Captcha": captcha,
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
