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
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<NovelPaginationResponse> {
        return this.client.post<NovelPaginationResponse>('/novel', args, {
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
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<ContentCharacterPaginationResponse> {
        return this.client.get<ContentCharacterPaginationResponse>(
            `/novel/${slug}/characters`,
            {
                page,
                size,
            },
        );
    }
}
