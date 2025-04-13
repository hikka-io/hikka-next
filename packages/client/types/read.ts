import { PaginationResponse } from './common';
import { MangaResponse } from './manga';
import { NovelResponse } from './novel';
import { UserResponse } from './user';

/**
 * Read content type enum
 */
export enum ReadContentTypeEnum {
    MANGA = 'manga',
    NOVEL = 'novel',
}

/**
 * Read status enum
 */
export enum ReadStatusEnum {
    COMPLETED = 'completed',
    READING = 'reading',
    ON_HOLD = 'on_hold',
    DROPPED = 'dropped',
    PLANNED = 'planned',
}

/**
 * Read entry request args
 */
export interface ReadArgs {
    note?: string | null;
    chapters?: number;
    volumes?: number;
    rereads?: number;
    score?: number;
    status: ReadStatusEnum;
}

/**
 * Read entry base response
 */
export interface ReadResponseBase {
    reference: string;
    note: string | null;
    updated: number;
    created: number;
    status: string;
    chapters: number;
    volumes: number;
    rereads: number;
    score: number;
}

/**
 * Full read entry response
 */
export interface ReadResponse {
    reference: string;
    note: string | null;
    updated: number;
    created: number;
    status: string;
    chapters: number;
    volumes: number;
    rereads: number;
    score: number;
    content: MangaResponse | NovelResponse;
}

/**
 * Paginated read response
 */
export interface ReadPaginationResponse {
    pagination: PaginationResponse;
    list: ReadResponse[];
}

/**
 * Read search args
 */
export interface ReadSearchArgs {
    years?: [number | null, number | null];
    media_type?: string[];
    status?: string[];
    only_translated?: boolean;
    magazines?: string[];
    genres?: string[];
    score?: [number | null, number | null];
    sort?: string[];
    read_status?: ReadStatusEnum | null;
}

/**
 * User response with read status
 */
export interface UserResponseWithRead extends UserResponse {
    read: ReadResponseBase[];
}

/**
 * Paginated user read response
 */
export interface UserReadPaginationResponse {
    pagination: PaginationResponse;
    list: UserResponseWithRead[];
}

/**
 * Read stats response
 */
export interface ReadStatsResponse {
    completed: number;
    reading: number;
    planned: number;
    dropped: number;
    on_hold: number;
}
