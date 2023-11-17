import config from '@/utils/api/config';

interface Response {
    pagination: Hikka.Pagination;
    list: {
        reference: string;
        created: number;
        anime: Hikka.Anime;
    }[];
}

export default async function req({
    username,
}: {
    username: string;
}): Promise<Response> {
    const res = await fetch(
        config.baseAPI + '/favourite/anime/' + username + '/list',
        {
            method: 'get',
            ...config.config.headers,
            next: {
                revalidate: 0
            }
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
