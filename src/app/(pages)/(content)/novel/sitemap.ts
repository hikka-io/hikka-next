import { toDate } from 'date-fns/toDate';
import { MetadataRoute } from 'next';

import getNovelSitemap from '@/services/api/sitemap/getNovelSitemap';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const res = await getNovelSitemap();

    return res.map((novel) => ({
        url: 'https://hikka.io/novel/' + novel.slug,
        lastModified: toDate(novel.updated_at * 1000),
        changeFrequency: 'weekly',
        priority: 1,
    }));
}
