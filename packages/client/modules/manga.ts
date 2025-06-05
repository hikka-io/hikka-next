import { DEFAULT_PAGINATION } from '../constants';
import {
    BaseRequestOptionsArgs,
    ContentCharacterPaginationResponse,
    MangaInfoResponse,
    MangaPaginationResponse,
    MangaSearchArgs,
    PaginationArgs,
} from '../types';
import { BaseModule } from './base';

export class MangaModule extends BaseModule {
    /**
     * Search for manga with filtering criteria
     */
    public async searchMangas(
        args: MangaSearchArgs,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<MangaPaginationResponse> {
        return this.client.post<MangaPaginationResponse>('/manga', args, {
            ...DEFAULT_PAGINATION,
            page,
            size,
            ...options,
        });
    }

    /**
     * Get manga details by slug
     */
    public async getMangaBySlug(
        slug: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<MangaInfoResponse> {
        return this.client.get<MangaInfoResponse>(`/manga/${slug}`, options);
    }

    /**
     * Get characters for a manga
     */
    public async getMangaCharacters(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<ContentCharacterPaginationResponse> {
        return this.client.get<ContentCharacterPaginationResponse>(
            `/manga/${slug}/characters`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }
}
