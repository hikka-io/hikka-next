import { DEFAULT_PAGINATION } from '../constants';
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
     * Search for articles with filtering criteria
     */
    public async searchArticles(
        args: ArticlesListArgs,
        { page, size }: PaginationArgs,
    ): Promise<ArticlesListResponse> {
        return this.client.post<ArticlesListResponse>('/articles', args, {
            ...DEFAULT_PAGINATION,
            page,
            size,
        });
    }

    /**
     * Get article details by slug
     */
    public async getArticleBySlug(slug: string): Promise<ArticleResponse> {
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
     * Get article statistics
     */
    public async getArticleStats(): Promise<ArticlesTopResponse> {
        return this.client.get<ArticlesTopResponse>('/articles/stats');
    }
}
