import config from '@/app/_utils/api/config';

export interface Response extends Hikka.Comment {}

export default async function req({
    secret,
    score,
    reference,
}: {
    secret: string;
    reference: string;
    score: 0 | -1 | 1;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + `/comments/vote/${reference}`, {
        method: 'put',
        body: JSON.stringify({ score }),
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