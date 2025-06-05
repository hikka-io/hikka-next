import { BaseRequestOptionsArgs, SitemapResponse } from '../types';
import { BaseModule } from './base';

export class SitemapModule extends BaseModule {
    /**
     * Get anime sitemap
     */
    public async getAnimeSitemap(
        options?: BaseRequestOptionsArgs,
    ): Promise<SitemapResponse[]> {
        return this.client.get<SitemapResponse[]>(
            '/sitemap/sitemap_anime.json',
            options,
        );
    }

    /**
     * Get manga sitemap
     */
    public async getMangaSitemap(
        options?: BaseRequestOptionsArgs,
    ): Promise<SitemapResponse[]> {
        return this.client.get<SitemapResponse[]>(
            '/sitemap/sitemap_manga.json',
            options,
        );
    }

    /**
     * Get novel sitemap
     */
    public async getNovelSitemap(
        options?: BaseRequestOptionsArgs,
    ): Promise<SitemapResponse[]> {
        return this.client.get<SitemapResponse[]>(
            '/sitemap/sitemap_novel.json',
            options,
        );
    }
}
