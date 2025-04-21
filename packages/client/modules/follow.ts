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
     * Follow a user
     */
    public async follow(username: string): Promise<FollowResponse> {
        return this.client.put<FollowResponse>(`/follow/${username}`);
    }

    /**
     * Unfollow a user
     */
    public async unfollow(username: string): Promise<FollowResponse> {
        return this.client.delete<FollowResponse>(`/follow/${username}`);
    }

    /**
     * Check if following a user
     */
    public async checkFollow(username: string): Promise<FollowResponse> {
        return this.client.get<FollowResponse>(`/follow/${username}`);
    }

    /**
     * Get follow stats for a user
     */
    public async getStats(username: string): Promise<FollowStatsResponse> {
        return this.client.get<FollowStatsResponse>(
            `/follow/${username}/stats`,
        );
    }

    /**
     * Get user followings
     */
    public async getFollowings(
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
     * Get user followers
     */
    public async getFollowers(
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
