import config from '@/app/_utils/api/config';

interface Response extends Hikka.User {}

export default async function req(params: {
    email: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/auth/password/reset', {
        method: 'post',
        body: JSON.stringify(params),
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
