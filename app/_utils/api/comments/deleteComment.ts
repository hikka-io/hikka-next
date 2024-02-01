import config from '@/app/_utils/api/config';

export interface Response extends Hikka.Comment {}

export default async function req({
    reference,
    secret,
}: {
    secret: string;
    reference: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + `/comments/${reference}`, {
        method: 'delete',
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