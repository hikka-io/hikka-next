import {
    AnimeWatchSearchArgs,
    WatchArgs,
    WatchStatusEnum,
} from '@hikka/client';

export interface UseWatchEntryParams {
    slug: string;
}

export interface UseWatchStatsParams {
    username: string;
}

export interface UseWatchListParams {
    username: string;
    args: AnimeWatchSearchArgs;
}

export interface UseFollowingWatchersParams {
    slug: string;
}

export interface UseCreateWatchParams {
    slug: string;
    args: WatchArgs;
}

export interface RandomAnimeVariables {
    username: string;
    status: WatchStatusEnum;
}
