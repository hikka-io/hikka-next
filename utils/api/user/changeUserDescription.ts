import config from '@/utils/api/config';

export interface Response {
    description: string;
}

export default async function req({
    description,
    secret,
}: {
    description: string;
    secret: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/user/description', {
        method: 'post',
        body: JSON.stringify({ description }),
        ...config.config,
        headers: {
            ...config.config.headers,
            auth: secret || '',
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
