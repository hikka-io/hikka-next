import { toDate } from 'date-fns/toDate';
import { MetadataRoute } from 'next';

import getMangaSitemap from '../../../../services/api/sitemap/getMangaSitemap';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const res = await getMangaSitemap();

    return res.map((manga) => ({
        url: 'https://hikka.io/manga/' + manga.slug,
        lastModified: toDate(manga.updated_at * 1000),
        changeFrequency: 'weekly',
        priority: 1,
    }));
}
