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
     * Get watch entry for an anime
     */
    public async get(slug: string): Promise<WatchResponse> {
        return this.client.get<WatchResponse>(`/watch/${slug}`);
    }

    /**
     * Add or update watch entry
     */
    public async addOrUpdate(
        slug: string,
        args: WatchArgs,
    ): Promise<WatchResponse> {
        return this.client.put<WatchResponse>(`/watch/${slug}`, args);
    }

    /**
     * Delete watch entry
     */
    public async delete(slug: string): Promise<SuccessResponse> {
        return this.client.delete<SuccessResponse>(`/watch/${slug}`);
    }

    /**
     * Get user's watch list
     */
    public async getList(
        username: string,
        args: AnimeWatchSearchArgs,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<WatchPaginationResponse> {
        return this.client.post<WatchPaginationResponse>(
            `/watch/${username}/list`,
            args,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get random watch entry
     */
    public async getRandom(
        username: string,
        status: WatchStatusEnum,
    ): Promise<AnimeResponse> {
        return this.client.get<AnimeResponse>(
            `/watch/random/${username}/${status}`,
        );
    }

    /**
     * Get users watching an anime
     */
    public async getFollowingUsers(
        slug: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<UserWatchPaginationResponse> {
        return this.client.get<UserWatchPaginationResponse>(
            `/watch/${slug}/following`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get user watch stats
     */
    public async getStats(username: string): Promise<WatchStatsResponse> {
        return this.client.get<WatchStatsResponse>(`/watch/${username}/stats`);
    }
}
