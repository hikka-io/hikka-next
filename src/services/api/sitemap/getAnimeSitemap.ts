import { BaseFetchRequestProps } from '@/services/api/fetchRequest';

export interface Response {
    updated_at: number;
    slug: string;
}

export default async function req(
    props?: BaseFetchRequestProps,
): Promise<Response[]> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sitemap/sitemap_anime.json`,
        {
            method: 'get',
            headers: {
                'Content-type': 'application/json',
            },
        },
    );

    return await res.json();
}
