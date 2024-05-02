import toDate from 'date-fns/toDate';
import { MetadataRoute } from 'next';

import getAnimeSitemap from '@/services/api/sitemap/getAnimeSitemap';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const res = await getAnimeSitemap();

    return res.map((anime) => ({
        url: 'https://hikka.io/anime/' + anime.slug,
        lastModified: toDate(anime.updated_at * 1000),
        changeFrequency: 'weekly',
        priority: 1,
    }));
}
