import { PaginationArgs } from '../types';
import { EditsTopPaginationResponse } from '../types/stats';
import { BaseModule } from './base';

/**
 * Module for handling statistics
 */
export class StatsModule extends BaseModule {
    /**
     * Get top editors
     */
    public async getEditsTop(
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<EditsTopPaginationResponse> {
        return this.client.get<EditsTopPaginationResponse>('/stats/edits/top', {
            page,
            size,
        });
    }
}
