import { DEFAULT_PAGINATION } from '../constants';
import {
    AnimeResponse,
    AnimeWatchSearchArgs,
    BaseRequestOptionsArgs,
    PaginationArgs,
    SuccessResponse,
    UserWatchPaginationResponse,
    WatchArgs,
    WatchPaginationResponse,
    WatchResponse,
    WatchStatsResponse,
    WatchStatusEnum,
} from '../types';
import { BaseModule } from './base';

export class WatchModule extends BaseModule {
    /**
     * Get watch entry details for an anime
     */
    public async getWatchBySlug(
        slug: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<WatchResponse> {
        return this.client.get<WatchResponse>(`/watch/${slug}`, options);
    }

    /**
     * Create or update a watch entry
     */
    public async createWatch(
        slug: string,
        args: WatchArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<WatchResponse> {
        return this.client.put<WatchResponse>(`/watch/${slug}`, args, options);
    }

    /**
     * Delete a watch entry
     */
    public async deleteWatch(
        slug: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(`/watch/${slug}`, options);
    }

    /**
     * Search watch list for a user with filtering criteria
     */
    public async searchUserWatches(
        username: string,
        args: AnimeWatchSearchArgs,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<WatchPaginationResponse> {
        return this.client.post<WatchPaginationResponse>(
            `/watch/${username}/list`,
            args,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get a random anime from user's watch list by status
     */
    public async getRandomWatchByStatus(
        username: string,
        status: WatchStatusEnum,
        options?: BaseRequestOptionsArgs,
    ): Promise<AnimeResponse> {
        return this.client.get<AnimeResponse>(
            `/watch/random/${username}/${status}`,
            options,
        );
    }

    /**
     * Get users who are watching a specific anime
     */
    public async getWatchingUsers(
        slug: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<UserWatchPaginationResponse> {
        return this.client.get<UserWatchPaginationResponse>(
            `/watch/${slug}/following`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get watch statistics for a user
     */
    public async getUserWatchStats(
        username: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<WatchStatsResponse> {
        return this.client.get<WatchStatsResponse>(
            `/watch/${username}/stats`,
            options,
        );
    }
}
