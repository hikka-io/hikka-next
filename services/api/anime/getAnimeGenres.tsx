import config from '@/services/api/config';

export default async function req(): Promise<{ list: Hikka.Genre[] }> {
    const res = await fetch(config.baseAPI + '/anime/genres', {
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
