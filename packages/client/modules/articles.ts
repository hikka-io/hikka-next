import {
    ArticleArgs,
    ArticleResponse,
    ArticlesListArgs,
    ArticlesListResponse,
    ArticlesTopResponse,
} from '../types/articles';
import { PaginationArgs } from '../types/common';
import { BaseModule } from './base';

/**
 * Module for handling articles
 */
export class ArticlesModule extends BaseModule {
    /**
     * Get a list of articles
     */
    public async getArticles(
        args: ArticlesListArgs,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<ArticlesListResponse> {
        return this.client.post<ArticlesListResponse>('/articles', args, {
            page,
            size,
        });
    }

    /**
     * Get article details by slug
     */
    public async getArticle(slug: string): Promise<ArticleResponse> {
        return this.client.get<ArticleResponse>(`/articles/${slug}`);
    }

    /**
     * Create a new article
     */
    public async createArticle(args: ArticleArgs): Promise<ArticleResponse> {
        return this.client.post<ArticleResponse>('/articles/create', args);
    }

    /**
     * Update an existing article
     */
    public async updateArticle(
        slug: string,
        args: ArticleArgs,
    ): Promise<ArticleResponse> {
        return this.client.put<ArticleResponse>(`/articles/${slug}`, args);
    }

    /**
     * Delete an article
     */
    public async deleteArticle(slug: string): Promise<void> {
        return this.client.delete(`/articles/${slug}`);
    }

    /**
     * Get article stats (top authors and tags)
     */
    public async getArticleStats(): Promise<ArticlesTopResponse> {
        return this.client.get<ArticlesTopResponse>('/articles/stats');
    }
}
