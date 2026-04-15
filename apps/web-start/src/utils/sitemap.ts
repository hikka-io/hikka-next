import { HikkaClient, SitemapResponse } from '@hikka/client';

import { createServerHikkaClient } from './cookies/headers';
import { getSiteUrl } from './url';

export const SITEMAP_RESPONSE_HEADERS = {
    'Content-Type': 'application/xml',
    'Cache-Control': 'public, max-age=3600, s-maxage=3600',
};

export const URLS_PER_SITEMAP = 10_000;

export interface SitemapIndexEntry {
    loc: string;
    lastmod?: string;
}

export function paginateSitemap(
    entries: SitemapResponse[],
    page: number,
): SitemapResponse[] | null {
    if (!Number.isInteger(page) || page < 1) return null;
    const start = (page - 1) * URLS_PER_SITEMAP;
    if (start >= entries.length) return null;
    return entries.slice(start, start + URLS_PER_SITEMAP);
}

export function getSitemapPageCount(entries: SitemapResponse[]): number {
    return Math.max(1, Math.ceil(entries.length / URLS_PER_SITEMAP));
}

export function getSlicedLastmod(entries: SitemapResponse[]): string {
    const max = entries.reduce((acc, e) => Math.max(acc, e.updated_at), 0);
    return new Date(max * 1000).toISOString();
}

export function buildSitemapXml(
    entries: SitemapResponse[],
    type: string,
): string {
    const siteUrl = getSiteUrl();
    const urls = entries
        .map(
            (entry) => `  <url>
    <loc>${siteUrl}/${type}/${entry.slug}</loc>
    <lastmod>${new Date(entry.updated_at * 1000).toISOString()}</lastmod>
  </url>`,
        )
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function handleTypeSitemapRequest(
    request: Request,
    type: 'anime' | 'manga' | 'novel',
    fetchEntries: (client: HikkaClient) => Promise<SitemapResponse[]>,
): Promise<Response> {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get('page');
    const page = pageParam === null ? 1 : Number(pageParam);

    const client = createServerHikkaClient();
    const entries = await fetchEntries(client);
    const pageEntries = paginateSitemap(entries, page);

    if (!pageEntries) {
        return new Response('Not Found', { status: 404 });
    }

    return new Response(buildSitemapXml(pageEntries, type), {
        headers: SITEMAP_RESPONSE_HEADERS,
    });
}

export function buildSitemapIndexXml(sitemaps: SitemapIndexEntry[]): string {
    const entries = sitemaps
        .map(({ loc, lastmod }) => {
            const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
            return `  <sitemap>
    <loc>${loc}</loc>${lastmodTag}
  </sitemap>`;
        })
        .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}
