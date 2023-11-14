import config from '@/utils/api/config';

export interface Response {
    follow: boolean;
}

export default async function req({
    username,
    secret,
}: {
    username: string;
    secret: string;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + '/follow/' + username,
        {
            method: 'get',
            ...config.config,
            headers: {
                ...config.config.headers,
                auth: secret || '',
            },
        },
    );

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
