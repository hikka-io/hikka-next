import {
    ContentCharacterPaginationResponse,
    MangaInfoResponse,
    MangaPaginationResponse,
    MangaSearchArgs,
    PaginationArgs,
} from '../types';
import { BaseModule } from './base';

export class MangaModule extends BaseModule {
    /**
     * Search for manga
     */
    public async search(
        args: MangaSearchArgs,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<MangaPaginationResponse> {
        return this.client.post<MangaPaginationResponse>('/manga', args, {
            page,
            size,
        });
    }

    /**
     * Get manga details by slug
     */
    public async getBySlug(slug: string): Promise<MangaInfoResponse> {
        return this.client.get<MangaInfoResponse>(`/manga/${slug}`);
    }

    /**
     * Get manga characters
     */
    public async getCharacters(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<ContentCharacterPaginationResponse> {
        return this.client.get<ContentCharacterPaginationResponse>(
            `/manga/${slug}/characters`,
            {
                page,
                size,
            },
        );
    }
}
