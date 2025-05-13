import { DEFAULT_PAGINATION } from '../constants';
import { PaginationArgs } from '../types';
import { HistoryPaginationResponse } from '../types/history';
import { BaseModule } from './base';

/**
 * Module for handling user history
 */
export class HistoryModule extends BaseModule {
    /**
     * Get the history of users that the current user follows
     */
    public async getFollowingHistory({
        page,
        size,
    }: PaginationArgs): Promise<HistoryPaginationResponse> {
        return this.client.get<HistoryPaginationResponse>(
            '/history/following',
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
            },
        );
    }

    /**
     * Get the history of a specific user
     */
    public async getUserHistory(
        username: string,
        { page, size }: PaginationArgs,
    ): Promise<HistoryPaginationResponse> {
        return this.client.get<HistoryPaginationResponse>(
            `/history/user/${username}`,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
            },
        );
    }
}
