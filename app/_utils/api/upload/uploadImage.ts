import config from '@/app/_utils/api/config';

export interface Response {
    url: string;
}

export default async function req({
    file,
    upload_type,
    secret,
}: {
    file: File;
    upload_type: 'avatar' | 'cover';
    secret: string;
}): Promise<Response> {
    let data = new FormData();
    data.append('file', file);

    const res = await fetch(config.baseAPI + '/upload/' + upload_type, {
        method: 'put',
        ...config.config,
        body: data,
        headers: {
            auth: secret || '',
        },
    });

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            throw await res.json();
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}