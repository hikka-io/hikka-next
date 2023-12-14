import config from '@/utils/api/config';

export interface Response {
    url: string;
}

export default async function req({
    provider,
}: {
    provider: 'google';
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/auth/oauth/' + provider, {
        method: 'get',
        ...config.config,
    });

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            throw await res.json();
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
