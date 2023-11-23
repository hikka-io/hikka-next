import config from '@/utils/api/config';

export interface Response {
    description: string;
}

export default async function req({
    password,
    secret,
}: {
    password: string;
    secret: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/settings/password', {
        method: 'put',
        body: JSON.stringify({ password }),
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
