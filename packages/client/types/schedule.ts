import { AnimeInfoResponse } from './anime';
import { ContentStatusEnum, PaginationResponse, SeasonEnum } from './common';

/**
 * Anime schedule arguments
 */
export interface AnimeScheduleArgs {
    airing_season?: (SeasonEnum | number)[] | null;
    rating?: string[];
    status?: ContentStatusEnum[];
    only_watch?: boolean;
}

/**
 * Anime schedule response
 */
export interface AnimeScheduleResponse {
    anime: AnimeInfoResponse;
    time_left: number;
    airing_at: number;
    episode: number;
}

/**
 * Paginated anime schedule response
 */
export interface AnimeScheduleResponsePaginationResponse {
    list: AnimeScheduleResponse[];
    pagination: PaginationResponse;
}
