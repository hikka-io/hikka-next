import { HikkaClient } from '@hikka/client';
import { toDate } from 'date-fns/toDate';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

const client = new HikkaClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const res = await client.sitemap.getMangaSitemap();

    return res.map((manga) => ({
        url: 'https://hikka.io/manga/' + manga.slug,
        lastModified: toDate(manga.updated_at * 1000),
        changeFrequency: 'weekly',
        priority: 1,
    }));
}
