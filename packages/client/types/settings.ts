import { UploadTypeEnum } from './upload';

/**
 * Description arguments
 */
export interface DescriptionArgs {
    description?: string | null;
}

/**
 * Password change arguments
 */
export interface PasswordArgs {
    password: string;
}

/**
 * Username change arguments
 */
export interface UsernameArgs {
    username: string;
}

/**
 * Image type enum
 */
export type ImageType = UploadTypeEnum.AVATAR | UploadTypeEnum.COVER;

/**
 * Import watch status enum
 */
export enum ImportWatchStatusEnum {
    COMPLETED = 'Completed',
    WATCHING = 'Watching',
    PLAN_TO_WATCH = 'Plan to Watch',
    ON_HOLD = 'On-Hold',
    DROPPED = 'Dropped',
    REWATCHING = 'Rewatching',
}

/**
 * Import watch arguments
 */
export interface ImportWatchArgs {
    series_animedb_id: number;
    my_watched_episodes: number;
    my_times_watched?: number;
    my_score?: number;
    my_status: ImportWatchStatusEnum;
    my_comments: string | object;
}

/**
 * Import watch list arguments
 */
export interface ImportWatchListArgs {
    anime: ImportWatchArgs[];
    overwrite: boolean;
}

/**
 * Import read status enum
 */
export enum ImportReadStatusEnum {
    COMPLETED = 'Completed',
    READING = 'Reading',
    PLAN_TO_READ = 'Plan to Read',
    ON_HOLD = 'On-Hold',
    DROPPED = 'Dropped',
}

/**
 * Import read arguments
 */
export interface ImportReadArgs {
    manga_mangadb_id: number;
    my_read_chapters: number;
    my_read_volumes: number;
    my_score: number;
    my_status: ImportReadStatusEnum;
    my_comments: string | object;
    my_times_read: number;
}

/**
 * Import read list arguments
 */
export interface ImportReadListArgs {
    content: ImportReadArgs[];
    overwrite: boolean;
}

/**
 * Read delete content type
 */
export enum ReadDeleteContenType {
    MANGA = 'manga',
    NOVEL = 'novel',
}
