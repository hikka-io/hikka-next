import config from '@/utils/api/config';

export default async function req(): Promise<Hikka.Genre[]> {
    const res = await fetch(config.baseAPI + '/anime/genres', {
        method: 'get',
        ...config.config,
    });

    return await res.json();
}
