import { AnimeResponse } from './anime';
import { PaginatedResponse } from './common';
import { MangaResponse } from './manga';
import { NovelResponse } from './novel';
import { ReadStatusEnum } from './read';
import { UserResponse } from './user';
import { WatchStatusEnum } from './watch';

/**
 * History response
 */
export interface HistoryResponse<
    TData =
        | HistoryWatchData
        | HistoryFavouriteData
        | HistoryWatchImportData
        | HistoryReadImportData
        | HistoryReadData,
> {
    content: AnimeResponse | MangaResponse | NovelResponse | null;
    created: number;
    updated: number;
    user: UserResponse;
    history_type: HistoryTypeEnum;
    reference: string;
    data: TData;
}

export interface HistoryReadData {
    after: {
        score: number | null;
        status: ReadStatusEnum | null;
        chapters: number | null;
        volumes: number | null;
        rereads: number | null;
    };
    before: {
        score: number | null;
        status: ReadStatusEnum | null;
        chapters: number | null;
        volumes: number | null;
        rereads: number | null;
    };
    new_read: boolean;
}

export interface HistoryWatchData {
    after: {
        score: number | null;
        status: WatchStatusEnum | null;
        episodes: number | null;
        rewatches: number | null;
    };
    before: {
        score: number | null;
        status: WatchStatusEnum | null;
        episodes: number | null;
        rewatches: number | null;
    };
    new_watch: boolean;
}

export interface HistoryFavouriteData {}

export interface HistoryWatchImportData {
    imported: number;
}

export interface HistoryReadImportData {
    imported_manga: number;
    imported_novel: number;
}

/**
 * Paginated history response
 */
export interface HistoryPaginationResponse
    extends PaginatedResponse<HistoryResponse> {}

export enum HistoryTypeEnum {
    WATCH = 'watch',
    WATCH_DELETE = 'watch_delete',
    READ_NOVEL = 'read_novel',
    READ_NOVEL_DELETE = 'read_novel_delete',
    READ_MANGA = 'read_manga',
    READ_MANGA_DELETE = 'read_manga_delete',
    WATCH_IMPORT = 'watch_import',
    READ_IMPORT = 'read_import',
    FAVOURITE_ANIME_ADD = 'favourite_anime_add',
    FAVOURITE_ANIME_REMOVE = 'favourite_anime_remove',
    FAVOURITE_MANGA_ADD = 'favourite_manga_add',
    FAVOURITE_MANGA_REMOVE = 'favourite_manga_remove',
    FAVOURITE_NOVEL_ADD = 'favourite_novel_add',
    FAVOURITE_NOVEL_REMOVE = 'favourite_novel_remove',
}
