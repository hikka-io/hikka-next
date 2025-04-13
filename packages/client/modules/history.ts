import { HistoryPaginationResponse } from '../types/history';
import { BaseModule } from './base';

/**
 * Module for handling user history
 */
export class HistoryModule extends BaseModule {
    /**
     * Get the history of users that the current user follows
     */
    public async getFollowingHistory(
        page: number = 1,
        size: number = 15,
    ): Promise<HistoryPaginationResponse> {
        return this.client.get<HistoryPaginationResponse>(
            '/history/following',
            {
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
        page: number = 1,
        size: number = 15,
    ): Promise<HistoryPaginationResponse> {
        return this.client.get<HistoryPaginationResponse>(
            `/history/user/${username}`,
            {
                page,
                size,
            },
        );
    }
}
