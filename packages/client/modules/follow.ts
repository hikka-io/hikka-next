import { PaginationArgs } from '../types';
import {
    FollowListResponse,
    FollowResponse,
    FollowStatsResponse,
} from '../types/follow';
import { BaseModule } from './base';

/**
 * Module for handling user follows
 */
export class FollowModule extends BaseModule {
    /**
     * Create a follow relationship with a user
     */
    public async createFollow(username: string): Promise<FollowResponse> {
        return this.client.put<FollowResponse>(`/follow/${username}`);
    }

    /**
     * Delete a follow relationship with a user
     */
    public async deleteFollow(username: string): Promise<FollowResponse> {
        return this.client.delete<FollowResponse>(`/follow/${username}`);
    }

    /**
     * Get follow status for a user
     */
    public async getFollowStatus(username: string): Promise<FollowResponse> {
        return this.client.get<FollowResponse>(`/follow/${username}`);
    }

    /**
     * Get follow statistics for a user
     */
    public async getUserFollowStats(
        username: string,
    ): Promise<FollowStatsResponse> {
        return this.client.get<FollowStatsResponse>(
            `/follow/${username}/stats`,
        );
    }

    /**
     * Get users followed by a specific user
     */
    public async getUserFollowings(
        username: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<FollowListResponse> {
        return this.client.get<FollowListResponse>(
            `/follow/${username}/following`,
            {
                page,
                size,
            },
        );
    }

    /**
     * Get users following a specific user
     */
    public async getUserFollowers(
        username: string,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<FollowListResponse> {
        return this.client.get<FollowListResponse>(
            `/follow/${username}/followers`,
            {
                page,
                size,
            },
        );
    }
}
