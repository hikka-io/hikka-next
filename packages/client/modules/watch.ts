import { DEFAULT_PAGINATION } from '../constants';
import {
    AnimeResponse,
    AnimeWatchSearchArgs,
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
    public async getWatchBySlug(slug: string): Promise<WatchResponse> {
        return this.client.get<WatchResponse>(`/watch/${slug}`);
    }

    /**
     * Create or update a watch entry
     */
    public async createWatch(
        slug: string,
        args: WatchArgs,
    ): Promise<WatchResponse> {
        return this.client.put<WatchResponse>(`/watch/${slug}`, args);
    }

    /**
     * Delete a watch entry
     */
    public async deleteWatch(slug: string): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(`/watch/${slug}`);
    }

    /**
     * Search watch list for a user with filtering criteria
     */
    public async searchUserWatches(
        username: string,
        args: AnimeWatchSearchArgs,
        { page, size }: PaginationArgs,
    ): Promise<WatchPaginationResponse> {
        return this.client.post<WatchPaginationResponse>(
            `/watch/${username}/list`,
            args,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
            },
        );
    }

    /**
     * Get a random anime from user's watch list by status
     */
    public async getRandomWatchByStatus(
        username: string,
        status: WatchStatusEnum,
    ): Promise<AnimeResponse> {
        return this.client.get<AnimeResponse>(
            `/watch/random/${username}/${status}`,
        );
    }

    /**
     * Get users who are watching a specific anime
     */
    public async getWatchingUsers(
        slug: string,
        { page, size }: PaginationArgs,
    ): Promise<UserWatchPaginationResponse> {
        return this.client.get<UserWatchPaginationResponse>(
            `/watch/${slug}/following`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
            },
        );
    }

    /**
     * Get watch statistics for a user
     */
    public async getUserWatchStats(
        username: string,
    ): Promise<WatchStatsResponse> {
        return this.client.get<WatchStatsResponse>(`/watch/${username}/stats`);
    }
}
