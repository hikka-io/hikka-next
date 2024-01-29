// https://api.hikka.io/edit/todo/anime/title_ua
import config from '@/utils/api/config';

export interface Response extends Hikka.WithPagination<Hikka.Anime> {}

export default async function req({
    param,
    secret,
    page = 1,
}: {
    param: string;
    secret?: string;
    page?: number;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + '/edit/todo/anime/' + param + '?size=18&page=' + page,
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
        if (res.status >= 400 && res.status <= 499) {
            throw await res.json();
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}