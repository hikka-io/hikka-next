import { DEFAULT_PAGINATION } from '../constants';
import {
    ContentCharacterPaginationResponse,
    NovelInfoResponse,
    NovelPaginationResponse,
    NovelSearchArgs,
    PaginationArgs,
} from '../types';
import { BaseModule } from './base';

export class NovelModule extends BaseModule {
    /**
     * Search for novels with filtering criteria
     */
    public async searchNovels(
        args: NovelSearchArgs,
        { page, size }: PaginationArgs,
    ): Promise<NovelPaginationResponse> {
        return this.client.post<NovelPaginationResponse>('/novel', args, {
            ...DEFAULT_PAGINATION,
            page,
            size,
        });
    }

    /**
     * Get novel details by slug
     */
    public async getNovelBySlug(slug: string): Promise<NovelInfoResponse> {
        return this.client.get<NovelInfoResponse>(`/novel/${slug}`);
    }

    /**
     * Get characters for a novel
     */
    public async getNovelCharacters(
        slug: string,
        { page, size }: PaginationArgs,
    ): Promise<ContentCharacterPaginationResponse> {
        return this.client.get<ContentCharacterPaginationResponse>(
            `/novel/${slug}/characters`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
            },
        );
    }
}
