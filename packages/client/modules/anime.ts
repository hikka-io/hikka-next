import { DEFAULT_PAGINATION } from '../constants';
import {
    AnimeEpisodesListResponse,
    AnimeInfoResponse,
    AnimePaginationResponse,
    AnimeSearchArgs,
    AnimeStaffPaginationResponse,
    BaseRequestOptionsArgs,
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
        options?: BaseRequestOptionsArgs,
    ): Promise<AnimePaginationResponse> {
        return this.client.post<AnimePaginationResponse>('/anime', args, {
            ...DEFAULT_PAGINATION,
            page,
            size,
            ...options,
        });
    }

    /**
     * Get anime details by slug
     */
    public async getAnimeBySlug(
        slug: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<AnimeInfoResponse> {
        return this.client.get<AnimeInfoResponse>(`/anime/${slug}`, options);
    }

    /**
     * Get characters for an anime
     */
    public async getAnimeCharacters(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<ContentCharacterPaginationResponse> {
        return this.client.get<ContentCharacterPaginationResponse>(
            `/anime/${slug}/characters`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get staff for an anime
     */
    public async getAnimeStaff(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<AnimeStaffPaginationResponse> {
        return this.client.get<AnimeStaffPaginationResponse>(
            `/anime/${slug}/staff`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get episodes for an anime
     */
    public async getAnimeEpisodes(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<AnimeEpisodesListResponse> {
        return this.client.get<AnimeEpisodesListResponse>(
            `/anime/${slug}/episodes`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get recommendations for an anime
     */
    public async getAnimeRecommendations(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<AnimePaginationResponse> {
        return this.client.get<AnimePaginationResponse>(
            `/anime/${slug}/recommendations`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get franchise entries for an anime
     */
    public async getAnimeFranchise(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<AnimePaginationResponse> {
        return this.client.get<AnimePaginationResponse>(
            `/anime/${slug}/franchise`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get all anime genres
     */
    public async getGenreList(
        options?: BaseRequestOptionsArgs,
    ): Promise<GenreListResponse> {
        return this.client.get<GenreListResponse>('/anime/genres', options);
    }
}
