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
     * Search for anime with filtering criteria
     */
    public async searchAnimes(
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
    public async getAnimeBySlug(slug: string): Promise<AnimeInfoResponse> {
        return this.client.get<AnimeInfoResponse>(`/anime/${slug}`);
    }

    /**
     * Get characters for an anime
     */
    public async getAnimeCharacters(
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
     * Get staff for an anime
     */
    public async getAnimeStaff(
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
     * Get episodes for an anime
     */
    public async getAnimeEpisodes(
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
     * Get recommendations for an anime
     */
    public async getAnimeRecommendations(
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
     * Get franchise entries for an anime
     */
    public async getAnimeFranchise(
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
    public async getGenreList(): Promise<GenreListResponse> {
        return this.client.get<GenreListResponse>('/anime/genres');
    }
}
