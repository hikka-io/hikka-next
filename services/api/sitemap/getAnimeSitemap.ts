import config from '@/services/api/config';

export interface Response {
    updated_at: number;
    slug: string;
}

export default async function req(): Promise<Response[]> {
    const res = await fetch(config.baseAPI + '/sitemap/sitemap_anime.json', {
        method: 'get',
        ...config.config,
        next: {
            revalidate: false,
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