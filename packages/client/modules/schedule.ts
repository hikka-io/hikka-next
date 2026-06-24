import { DEFAULT_PAGINATION } from '../constants';
import type { BaseRequestOptionsArgs, PaginationArgs } from '../types';
import type {
    AnimeScheduleArgs,
    AnimeScheduleResponsePaginationResponse,
} from '../types/schedule';
import { BaseModule } from './base';

/**
 * Module for handling schedules
 */
export class ScheduleModule extends BaseModule {
    /**
     * Search anime schedule with filtering criteria
     */
    public async searchAnimeSchedule(
        args: AnimeScheduleArgs,
        { page, size }: PaginationArgs,
        options?: BaseRequestOptionsArgs,
    ): Promise<AnimeScheduleResponsePaginationResponse> {
        return this.client.post<AnimeScheduleResponsePaginationResponse>(
            '/schedule/anime',
            args,
            {
                ...DEFAULT_PAGINATION,
                page,
                size,
                ...options,
            },
        );
    }
}
