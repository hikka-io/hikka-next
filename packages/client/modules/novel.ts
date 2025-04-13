import {
    ContentCharacterPaginationResponse,
    NovelInfoResponse,
    NovelPaginationResponse,
    NovelSearchArgs,
} from '../types';
import { BaseModule } from './base';

export class NovelModule extends BaseModule {
    /**
     * Search for novels
     */
    public async search(
        args: NovelSearchArgs,
        page: number = 1,
        size: number = 15,
    ): Promise<NovelPaginationResponse> {
        return this.client.post<NovelPaginationResponse>('/novel', args, {
            page,
            size,
        });
    }

    /**
     * Get novel details by slug
     */
    public async getBySlug(slug: string): Promise<NovelInfoResponse> {
        return this.client.get<NovelInfoResponse>(`/novel/${slug}`);
    }

    /**
     * Get novel characters
     */
    public async getCharacters(
        slug: string,
        page: number = 1,
        size: number = 15,
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
