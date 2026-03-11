import { SitemapResponse } from '@hikka/client';

export function buildSitemapXml(
    entries: SitemapResponse[],
    type: string,
): string {
    const urls = entries
        .map(
            (entry) => `  <url>
    <loc>https://hikka.io/${type}/${entry.slug}</loc>
    <lastmod>${new Date(entry.updated_at * 1000).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
        )
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function buildSitemapIndexXml(sitemaps: string[]): string {
    const entries = sitemaps
        .map(
            (url) => `  <sitemap>
    <loc>${url}</loc>
  </sitemap>`,
        )
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}
