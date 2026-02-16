import {
    AnimeAgeRatingEnum,
    AnimeMediaEnum,
    AnimeResponse,
    AnimeStatusEnum,
} from './anime';
import { PaginationResponse, SeasonEnum, SourceEnum } from './common';
import { UserResponse } from './user';

/**
 * Watch status enum
 */
export enum WatchStatusEnum {
    COMPLETED = 'completed',
    WATCHING = 'watching',
    PLANNED = 'planned',
    ON_HOLD = 'on_hold',
    DROPPED = 'dropped',
}

/**
 * Watch entry request args
 */
export interface WatchArgs {
    note?: string | null;
    episodes?: number;
    rewatches?: number;
    score?: number;
    start_date?: number;
    end_date?: number;
    status: WatchStatusEnum;
}

/**
 * Watch entry base response
 */
export interface WatchResponseBase {
    reference: string;
    note: string | null;
    updated: number;
    created: number;
    status: WatchStatusEnum;
    rewatches: number;
    duration: number;
    episodes: number;
    score: number;
}

/**
 * Full watch entry response
 */
export interface WatchResponse extends WatchResponseBase {
    anime: AnimeResponse;
}

/**
 * Paginated watch response
 */
export interface WatchPaginationResponse {
    pagination: PaginationResponse;
    list: WatchResponse[];
}

/**
 * Anime watch search args
 */
export interface AnimeWatchSearchArgs {
    years?: [number | null, number | null];
    include_multiseason?: boolean;
    only_translated?: boolean;
    score?: [number | null, number | null];
    media_type?: AnimeMediaEnum[];
    rating?: AnimeAgeRatingEnum[];
    status?: AnimeStatusEnum[];
    source?: SourceEnum[];
    season?: SeasonEnum[];
    producers?: string[];
    studios?: string[];
    genres?: string[];
    sort?: string[];
    watch_status?: WatchStatusEnum | null;
}

/**
 * User response with watch status
 */
export interface UserResponseWithWatch extends UserResponse {
    watch: WatchResponseBase[];
}

/**
 * Paginated user watch response
 */
export interface UserWatchPaginationResponse {
    pagination: PaginationResponse;
    list: UserResponseWithWatch[];
}

/**
 * Watch stats response
 */
export interface WatchStatsResponse {
    duration: number;
    completed: number;
    watching: number;
    planned: number;
    dropped: number;
    on_hold: number;
}
