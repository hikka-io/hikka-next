'use client';

import {
    ImportReadArgs,
    ImportReadStatusEnum,
    ImportWatchArgs,
    ImportWatchStatusEnum,
} from '@hikka/client';
import { UseMutationResult, useMutation } from '@tanstack/react-query';

export interface Response {
    data: {
        MediaListCollection: {
            lists: {
                name: AnilistStatusEnum;
                isCustomList: boolean;
                isCompletedList: boolean;
                entries: {
                    id: number;
                    mediaId: number;
                    status:
                        | 'COMPLETED'
                        | 'PLANNING'
                        | 'DROPPED'
                        | 'PAUSED'
                        | 'WATCHING'
                        | 'REWATCHING';
                    score: number;
                    progress: number;
                    progressVolumes: number | null;
                    repeat: number;
                    priority: number;
                    private: boolean;
                    hiddenFromStatusLists: boolean;
                    customLists: null;
                    advancedScores: {
                        Story: number;
                        Characters: number;
                        Visuals: number;
                        Audio: number;
                        Enjoyment: number;
                    };
                    notes: string;
                    updatedAt: number;
                    startedAt: {
                        year: number;
                        month: number;
                        day: number;
                    };
                    completedAt: {
                        year: number;
                        month: number;
                        day: number;
                    };
                    media: {
                        id: number;
                        idMal: number;
                        title: {
                            userPreferred: string;
                            romaji: string;
                            english: string;
                            native: string;
                        };
                        coverImage: {
                            extraLarge: string;
                            large: string;
                        };
                        type: 'ANIME';
                        format: 'TV' | 'SPECIAL' | 'OVA' | 'MOVIE' | 'ONA';
                        status: 'FINISHED';
                        episodes: number;
                        volumes: number;
                        chapters: number;
                        averageScore: number;
                        popularity: number;
                        isAdult: boolean;
                        countryOfOrigin: 'JP';
                        genres: string[];
                        bannerImage: string;
                        startDate: {
                            year: number;
                            month: number;
                            day: number;
                        };
                    };
                }[];
            }[];
        };
    };
}

export interface MALEntry {
    series_animedb_id: number;
    series_title: string;
    series_type: string;
    series_episodes: number;
    my_id: number;
    my_watched_episodes: number;
    my_start_date: string;
    my_finish_date: string;
    my_rated: Record<string, any>;
    my_score: number;
    my_storage: Record<string, any>;
    my_storage_value: number;
    my_status: string;
    my_comments: string | Record<string, any>;
    my_times_watched: number;
    my_rewatch_value: Record<string, any>;
    my_priority: string;
    my_tags: Record<string, any>;
    my_rewatching: number;
    my_rewatching_ep: number;
    my_discuss: number;
    my_sns: string;
    update_on_import: number;
}

const ANILIST_QUERY = `
    query($userId:Int,$userName:String,$type:MediaType){
        MediaListCollection(userId:$userId,userName:$userName,type:$type){
            lists{
                name isCustomList isCompletedList:isSplitCompletedList entries{
                    ...mediaListEntry
                }
            }
        }
    }
    fragment mediaListEntry on MediaList{
        id mediaId status score(format: POINT_10_DECIMAL) progress progressVolumes repeat priority private hiddenFromStatusLists customLists advancedScores notes updatedAt startedAt{year month day}completedAt{year month day}media{id idMal title{userPreferred romaji english native}coverImage{extraLarge large}type format status(version:2)episodes volumes chapters averageScore popularity isAdult countryOfOrigin genres bannerImage startDate{year month day}}
    }
`;

export enum AnilistTypeEnum {
    ANIME = 'ANIME',
    MANGA = 'MANGA',
}

enum AnilistStatusEnum {
    CURRENT = 'Current',
    REPEATING = 'Repeating',
    COMPLETED = 'Completed',
    PLANNING = 'Planning',
    DROPPED = 'Dropped',
    PAUSED = 'Paused',
    WATCHING = 'Watching',
    REWATCHING = 'Rewatching',
}

export interface AnilistParams {
    username: string;
    type: AnilistTypeEnum;
    isCustomList?: boolean;
}

const getReadStatus = (
    anilistStatus: AnilistStatusEnum,
): ImportReadStatusEnum => {
    switch (anilistStatus) {
        case AnilistStatusEnum.CURRENT:
            return ImportReadStatusEnum.READING;
        case AnilistStatusEnum.REPEATING:
            return ImportReadStatusEnum.READING;
        case AnilistStatusEnum.COMPLETED:
            return ImportReadStatusEnum.COMPLETED;
        case AnilistStatusEnum.DROPPED:
            return ImportReadStatusEnum.DROPPED;
        case AnilistStatusEnum.PAUSED:
            return ImportReadStatusEnum.ON_HOLD;
        case AnilistStatusEnum.PLANNING:
            return ImportReadStatusEnum.PLAN_TO_READ;
        default:
            return ImportReadStatusEnum.PLAN_TO_READ;
    }
};

const getWatchStatus = (
    anilistStatus: AnilistStatusEnum,
): ImportWatchStatusEnum => {
    switch (anilistStatus) {
        case AnilistStatusEnum.WATCHING:
            return ImportWatchStatusEnum.WATCHING;
        case AnilistStatusEnum.REWATCHING:
            return ImportWatchStatusEnum.WATCHING;
        case AnilistStatusEnum.COMPLETED:
            return ImportWatchStatusEnum.COMPLETED;
        case AnilistStatusEnum.DROPPED:
            return ImportWatchStatusEnum.DROPPED;
        case AnilistStatusEnum.PAUSED:
            return ImportWatchStatusEnum.ON_HOLD;
        case AnilistStatusEnum.PLANNING:
            return ImportWatchStatusEnum.PLAN_TO_WATCH;
        default:
            return ImportWatchStatusEnum.PLAN_TO_WATCH;
    }
};

/**
 * Fetches a user's anime list from Anilist and transforms it
 */
const fetchAnilistData = async ({
    username,
    isCustomList = false,
    type,
}: AnilistParams): Promise<ImportWatchArgs[] | ImportReadArgs[]> => {
    if (!type) {
        throw new Error('Required arument `type` is missing');
    }

    const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            query: ANILIST_QUERY,
            variables: {
                userName: username,
                type,
            },
        }),
    });

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            throw Error('Failed to fetch data');
        }
        throw new Error('Internal server error');
    }

    const data: Response = await res.json();

    if (!data) {
        throw Error('Failed to parse data');
    }

    switch (type) {
        case AnilistTypeEnum.ANIME:
            return transformAnilistAnimeData(data, isCustomList);
        case AnilistTypeEnum.MANGA:
            return transformAnilistMangaData(data, isCustomList);
    }
};

/**
 * Transforms Anilist API response to standard format
 */
const transformAnilistAnimeData = (
    data: Response,
    isCustomList = false,
): ImportWatchArgs[] => {
    const reformatted: ImportWatchArgs[] = [];

    data.data.MediaListCollection.lists.forEach((list) => {
        if (isCustomList ? list.isCustomList : !list.isCustomList) {
            list.entries.forEach((entry) => {
                if (!Number.isInteger(entry.media.idMal)) {
                    return;
                }

                const watchStatus = isCustomList
                    ? list.name
                    : getWatchStatus(
                          list.name === AnilistStatusEnum.REWATCHING
                              ? AnilistStatusEnum.WATCHING
                              : list.isCompletedList
                                ? AnilistStatusEnum.COMPLETED
                                : list.name,
                      );

                const MALEntry: ImportWatchArgs = {
                    series_animedb_id: entry.media.idMal,
                    my_watched_episodes: entry.progress,
                    my_score: entry.score >= 1 ? Math.round(entry.score) : 0,
                    my_status: watchStatus as ImportWatchStatusEnum,
                    my_comments:
                        entry.notes && entry.notes.length > 0
                            ? String(entry.notes)
                            : {},
                    my_times_watched: entry.repeat,
                };

                reformatted.push(MALEntry);
            });
        }
    });

    return reformatted;
};

/**
 * Transforms Anilist API response to standard format
 */
const transformAnilistMangaData = (
    data: Response,
    isCustomList = false,
): ImportReadArgs[] => {
    const reformatted: ImportReadArgs[] = [];

    data.data.MediaListCollection.lists.forEach((list) => {
        if (isCustomList ? list.isCustomList : !list.isCustomList) {
            list.entries.forEach((entry) => {
                if (!Number.isInteger(entry.media.idMal)) {
                    return;
                }

                const readStatus = isCustomList
                    ? (list.name as unknown as ImportReadStatusEnum)
                    : getReadStatus(
                          list.isCompletedList
                              ? AnilistStatusEnum.COMPLETED
                              : list.name,
                      );

                const readEntry: ImportReadArgs = {
                    manga_mangadb_id: entry.media.idMal,
                    my_read_chapters: entry.progress,
                    my_read_volumes: entry.progressVolumes ?? 0,
                    my_score: entry.score >= 1 ? Math.round(entry.score) : 0,
                    my_status: readStatus,
                    my_comments:
                        entry.notes && entry.notes.length > 0
                            ? String(entry.notes)
                            : {},
                    my_times_read: entry.repeat,
                };

                reformatted.push(readEntry);
            });
        }
    });

    return reformatted;
};

/**
 * React hook for fetching an Anilist user's anime list
 */
export function useAnilist({
    options,
}: {
    options?: Omit<
        Parameters<
            typeof useMutation<
                ImportWatchArgs[] | ImportReadArgs[],
                Error,
                AnilistParams,
                unknown
            >
        >[0],
        'mutationFn'
    >;
} = {}): UseMutationResult<
    ImportWatchArgs[] | ImportReadArgs[],
    Error,
    AnilistParams,
    unknown
> {
    return useMutation({
        mutationFn: fetchAnilistData,
        ...options,
    });
}
