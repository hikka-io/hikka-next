import {
    AnimeEpisodesListResponse,
    AnimeInfoResponse,
    AnimePaginationResponse,
    AnimeSearchArgs,
    AnimeStaffPaginationResponse,
    ContentCharacterPaginationResponse,
    GenreListResponse,
    PaginationArgs,
} from '../types';
import { BaseModule } from './base';

export class AnimeModule extends BaseModule {
    /**
     * Search for anime
     */
    public async search(
        args: AnimeSearchArgs,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<AnimePaginationResponse> {
        return this.client.post<AnimePaginationResponse>('/anime', args, {
            page,
            size,
        });
    }

    /**
     * Get anime details by slug
     */
    public async getBySlug(slug: string): Promise<AnimeInfoResponse> {
        return this.client.get<AnimeInfoResponse>(`/anime/${slug}`);
    }

    /**
     * Get anime characters
     */
    public async getCharacters(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<ContentCharacterPaginationResponse> {
        return this.client.get<ContentCharacterPaginationResponse>(
            `/anime/${slug}/characters`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get anime staff
     */
    public async getStaff(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<AnimeStaffPaginationResponse> {
        return this.client.get<AnimeStaffPaginationResponse>(
            `/anime/${slug}/staff`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get anime episodes
     */
    public async getEpisodes(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<AnimeEpisodesListResponse> {
        return this.client.get<AnimeEpisodesListResponse>(
            `/anime/${slug}/episodes`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get anime recommendations
     */
    public async getRecommendations(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<AnimePaginationResponse> {
        return this.client.get<AnimePaginationResponse>(
            `/anime/${slug}/recommendations`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get anime franchise entries
     */
    public async getFranchise(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<AnimePaginationResponse> {
        return this.client.get<AnimePaginationResponse>(
            `/anime/${slug}/franchise`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get all anime genres
     */
    public async getGenres(): Promise<GenreListResponse> {
        return this.client.get<GenreListResponse>('/anime/genres');
    }
}
