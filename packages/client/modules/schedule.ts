import { PaginationArgs } from '../types';
import {
    AnimeScheduleArgs,
    AnimeScheduleResponsePaginationResponse,
} from '../types/schedule';
import { BaseModule } from './base';

/**
 * Module for handling schedules
 */
export class ScheduleModule extends BaseModule {
    /**
     * Get anime schedule
     */
    public async getAnimeSchedule(
        args: AnimeScheduleArgs,
        { page, size }: PaginationArgs = { page: 1, size: 15 },
    ): Promise<AnimeScheduleResponsePaginationResponse> {
        return this.client.post<AnimeScheduleResponsePaginationResponse>(
            '/schedule/anime',
            args,
            {
                page,
                size,
            },
        );
    }
}
