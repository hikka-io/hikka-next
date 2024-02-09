import config from '@/services/api/config';

export interface Response extends Hikka.Watch {}

export default async function req({
    slug,
    secret,
}: {
    slug: string;
    secret: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/watch/' + slug, {
        method: 'get',
        ...config.config,
        headers: {
            ...config.config.headers,
            auth: secret || '',
        },
    });

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            throw await res.json();
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
