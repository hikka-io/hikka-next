import { SitemapResponse } from '../types';
import { BaseModule } from './base';

export class SitemapModule extends BaseModule {
    /**
     * Get anime sitemap
     */
    public async getAnimeSitemap(): Promise<SitemapResponse[]> {
        return this.client.get<SitemapResponse[]>(
            '/sitemap/sitemap_anime.json',
        );
    }

    /**
     * Get manga sitemap
     */
    public async getMangaSitemap(): Promise<SitemapResponse[]> {
        return this.client.get<SitemapResponse[]>(
            '/sitemap/sitemap_manga.json',
        );
    }

    /**
     * Get novel sitemap
     */
    public async getNovelSitemap(): Promise<SitemapResponse[]> {
        return this.client.get<SitemapResponse[]>(
            '/sitemap/sitemap_novel.json',
        );
    }
}
