import config from '@/services/api/config';

interface Response {
    reference: string;
    description: string;
    created: number;
    username: string;
    avatar: string;
}

export default async function req({
    secret,
}: {
    secret: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/auth/activation/resend', {
        method: 'post',
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
