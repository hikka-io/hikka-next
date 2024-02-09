import config from '@/services/api/config';

export interface Response extends Hikka.Anime {}

export default async function req({
    username,
    status,
}: {
    username: string;
    status: Hikka.WatchStatus;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/watch/random/' + username + '/' + status, {
        method: 'get',
        ...config.config,
        headers: {
            ...config.config.headers,
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