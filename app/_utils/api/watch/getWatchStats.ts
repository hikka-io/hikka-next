import config from '@/app/_utils/api/config';

export default async function req({
    username,
}: {
    username: string;
}): Promise<Record<Hikka.WatchStatus, number>> {
    const res = await fetch(config.baseAPI + '/watch/' + username + '/stats', {
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
