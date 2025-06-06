import { DEFAULT_PAGINATION } from '../constants';
import { BaseRequestOptionsArgs, PaginationArgs } from '../types';
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
    public async createFollow(
        username: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<FollowResponse> {
        return this.client.put<FollowResponse>(
            `/follow/${username}`,
            undefined,
            options,
        );
    }

    /**
     * Delete a follow relationship with a user
     */
    public async deleteFollow(
        username: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<FollowResponse> {
        return this.client.delete<FollowResponse>(
            `/follow/${username}`,
            options,
        );
    }

    /**
     * Get follow status for a user
     */
    public async getFollowStatus(
        username: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<FollowResponse> {
        return this.client.get<FollowResponse>(`/follow/${username}`, options);
    }

    /**
     * Get follow statistics for a user
     */
    public async getUserFollowStats(
        username: string,
        options?: BaseRequestOptionsArgs,
    ): Promise<FollowStatsResponse> {
        return this.client.get<FollowStatsResponse>(
            `/follow/${username}/stats`,
            options,
        );
    }

    /**
     * Get users followed by a specific user
     */
    public async getUserFollowings(
        username: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<FollowListResponse> {
        return this.client.get<FollowListResponse>(
            `/follow/${username}/following`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }

    /**
     * Get users following a specific user
     */
    public async getUserFollowers(
        username: string,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<FollowListResponse> {
        return this.client.get<FollowListResponse>(
            `/follow/${username}/followers`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }
}
