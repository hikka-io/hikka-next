import config from '@/services/api/config';

export interface Response {
    pagination: Hikka.Pagination;
    list: Hikka.User[];
}

export default async function req({
    username,
    secret,
    page = 1,
}: {
    username: string;
    secret?: string;
    page?: number;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + '/follow/' + username + '/following?page=' + page,
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
