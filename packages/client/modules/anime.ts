import { DEFAULT_PAGINATION } from '../constants';
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
        { page, size }: PaginationArgs,
    ): Promise<AnimePaginationResponse> {
        return this.client.post<AnimePaginationResponse>('/anime', args, {
            ...DEFAULT_PAGINATION,
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
        { page, size }: PaginationArgs,
    ): Promise<ContentCharacterPaginationResponse> {
        return this.client.get<ContentCharacterPaginationResponse>(
            `/anime/${slug}/characters`,
            {
                ...DEFAULT_PAGINATION,
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
        { page, size }: PaginationArgs,
    ): Promise<AnimeStaffPaginationResponse> {
        return this.client.get<AnimeStaffPaginationResponse>(
            `/anime/${slug}/staff`,
            {
                ...DEFAULT_PAGINATION,
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
        { page, size }: PaginationArgs,
    ): Promise<AnimeEpisodesListResponse> {
        return this.client.get<AnimeEpisodesListResponse>(
            `/anime/${slug}/episodes`,
            {
                ...DEFAULT_PAGINATION,
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
        { page, size }: PaginationArgs,
    ): Promise<AnimePaginationResponse> {
        return this.client.get<AnimePaginationResponse>(
            `/anime/${slug}/recommendations`,
            {
                ...DEFAULT_PAGINATION,
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
        { page, size }: PaginationArgs,
    ): Promise<AnimePaginationResponse> {
        return this.client.get<AnimePaginationResponse>(
            `/anime/${slug}/franchise`,
            {
                ...DEFAULT_PAGINATION,
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
