import config from '@/utils/api/config';

export interface Response extends Hikka.Comment {}

export default async function req({
    reference,
    secret,
    text,
}: {
    secret: string;
    reference: string;
    text: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + `/comments/${reference}`, {
        method: 'put',
        body: JSON.stringify({ text }),
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