import { HikkaClient } from '@hikka/client';
import { toDate } from 'date-fns/toDate';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

const client = new HikkaClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const res = await client.sitemap.getAnimeSitemap();

    return res.map((anime) => ({
        url: 'https://hikka.io/anime/' + anime.slug,
        lastModified: toDate(anime.updated_at * 1000),
        changeFrequency: 'weekly',
        priority: 1,
    }));
}
