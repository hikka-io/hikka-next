import config from '@/utils/api/config';

export interface Response {
    pagination: Hikka.Pagination;
    list: {
        reference: string;
        username: string;
        avatar: string;
    }[];
}

export default async function req({
    username,
}: {
    username: string;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + '/follow/' + username + '/following',
        {
            method: 'get',
            ...config.config,
        },
    );

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
