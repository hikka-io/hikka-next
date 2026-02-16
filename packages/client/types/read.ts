import {
    ContentStatusEnum,
    ContentTypeEnum,
    PaginatedResponse,
} from './common';
import { MangaMediaEnum, MangaResponse } from './manga';
import { NovelMediaEnum, NovelResponse } from './novel';
import { UserResponse } from './user';

/**
 * Read content type enum
 */
export type ReadContentType = ContentTypeEnum.MANGA | ContentTypeEnum.NOVEL;

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
    start_date?: number;
    end_date?: number;
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
    status: ReadStatusEnum;
    chapters: number;
    volumes: number;
    rereads: number;
    score: number;
}

/**
 * Full read entry response
 */
export interface ReadResponse extends ReadResponseBase {
    content: MangaResponse | NovelResponse;
}

/**
 * Paginated read response
 */
export interface ReadPaginationResponse
    extends PaginatedResponse<ReadResponse> {}

/**
 * Read search args
 */
export interface ReadSearchArgs {
    years?: [number | null, number | null];
    media_type?: (NovelMediaEnum | MangaMediaEnum)[];
    status?: ContentStatusEnum[];
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
export interface UserReadPaginationResponse
    extends PaginatedResponse<UserResponseWithRead> {}

/**
 * Read stats response
 */
export interface ReadStatsResponse {
    completed: number;
    reading: number;
    planned: number;
    dropped: number;
    on_hold: number;
    score_1: number;
    score_2: number;
    score_3: number;
    score_4: number;
    score_5: number;
    score_6: number;
    score_7: number;
    score_8: number;
    score_9: number;
    score_10: number;
}
