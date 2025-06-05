import { HikkaClient } from '@hikka/client';
import { toDate } from 'date-fns/toDate';
import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

const client = new HikkaClient({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const res = await client.sitemap.getNovelSitemap();

    return res.map((novel) => ({
        url: 'https://hikka.io/novel/' + novel.slug,
        lastModified: toDate(novel.updated_at * 1000),
        changeFrequency: 'weekly',
        priority: 1,
    }));
}
