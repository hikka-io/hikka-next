import config from '@/utils/api/config';

interface Response {
    description: string;
    created: number;
    username: string;
    avatar: string;
}

export default async function req({
    username,
}: {
    username: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/user/' + username, {
        method: 'get',
        ...config.config,
    });

    if (!res.ok) {
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}
