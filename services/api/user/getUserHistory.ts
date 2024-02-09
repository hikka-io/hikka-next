import config from '@/services/api/config';

export interface Response extends Hikka.WithPagination<Hikka.History> {}

export default async function req({
    page = 1,
    username,
}: {
    page?: number;
    username: string;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + `/user/${username}/history?page=` + page,
        {
            method: 'get',
            ...config.config,
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