import { DEFAULT_PAGINATION } from '../constants';
import { BaseRequestOptionsArgs, PaginationArgs } from '../types';
import { EditsTopPaginationResponse } from '../types/stats';
import { BaseModule } from './base';

/**
 * Module for handling statistics
 */
export class StatsModule extends BaseModule {
    /**
     * Get top editors list with statistics
     */
    public async getTopEditorsList(
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<EditsTopPaginationResponse> {
        return this.client.get<EditsTopPaginationResponse>('/stats/edits/top', {
            ...DEFAULT_PAGINATION,
            page,
            size,
            ...options,
        });
    }
}
