import { AnimeResponse } from './anime';
import { PaginationResponse } from './common';
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
    status: string;
    rewatches: number;
    duration: number;
    episodes: number;
    score: number;
}

/**
 * Full watch entry response
 */
export interface WatchResponse {
    reference: string;
    note: string | null;
    updated: number;
    created: number;
    status: string;
    rewatches: number;
    duration: number;
    episodes: number;
    score: number;
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
    media_type?: string[];
    rating?: string[];
    status?: string[];
    source?: string[];
    season?: string[];
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
