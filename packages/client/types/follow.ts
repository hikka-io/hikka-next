import { PaginationResponse } from './common';
import { UserResponse } from './user';

/**
 * Follow response
 */
export interface FollowResponse {
    follow: boolean;
}

/**
 * Parameters for follow operations
 */
export interface FollowParams {
    username: string;
}

/**
 * Follow stats response
 */
export interface FollowStatsResponse {
    following: number;
    followers: number;
}

/**
 * Follow list response
 */
export interface FollowListResponse {
    list: UserResponse[];
    pagination: PaginationResponse;
}
