import config from '@/utils/api/config';

export interface Response {
    pagination: Hikka.Pagination;
    list: Hikka.User[];
}

export default async function req({
    username,
}: {
    username: string;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + '/follow/' + username + '/followers',
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
