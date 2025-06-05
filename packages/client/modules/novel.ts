import { DEFAULT_PAGINATION } from '../constants';
import {
    BaseRequestOptionsArgs,
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
        options?: BaseRequestOptionsArgs,
    ): Promise<NovelPaginationResponse> {
        return this.client.post<NovelPaginationResponse>('/novel', args, {
            ...DEFAULT_PAGINATION,
            page,
            size,
            ...options,
        });
    }

    /**
     * Get novel details by slug
     */
    public async getNovelBySlug(
        slug: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<NovelInfoResponse> {
        return this.client.get<NovelInfoResponse>(`/novel/${slug}`, options);
    }

    /**
     * Get characters for a novel
     */
    public async getNovelCharacters(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<ContentCharacterPaginationResponse> {
        return this.client.get<ContentCharacterPaginationResponse>(
            `/novel/${slug}/characters`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }
}
