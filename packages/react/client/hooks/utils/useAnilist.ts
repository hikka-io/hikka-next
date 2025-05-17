'use client';

import { ImportWatchArgs, ImportWatchStatusEnum } from '@hikka/client';
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
                    progressVolumes: null;
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

export interface AnilistParams {
    username: string;
    isCustomList?: boolean;
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

enum AnilistStatusEnum {
    COMPLETED = 'Completed',
    PLANNING = 'Planning',
    DROPPED = 'Dropped',
    PAUSED = 'Paused',
    WATCHING = 'Watching',
    REWATCHING = 'Rewatching',
}
const getWatchStatus = (
    anilistStatus: AnilistStatusEnum,
): ImportWatchStatusEnum => {
    switch (anilistStatus) {
        case AnilistStatusEnum.WATCHING:
            return ImportWatchStatusEnum.WATCHING;
        case AnilistStatusEnum.COMPLETED:
            return ImportWatchStatusEnum.COMPLETED;
        case AnilistStatusEnum.DROPPED:
            return ImportWatchStatusEnum.DROPPED;
        case AnilistStatusEnum.PAUSED:
            return ImportWatchStatusEnum.ON_HOLD;
        case AnilistStatusEnum.PLANNING:
            return ImportWatchStatusEnum.PLAN_TO_WATCH;
        case AnilistStatusEnum.REWATCHING:
            return ImportWatchStatusEnum.REWATCHING;
    }
};

/**
 * Fetches a user's anime list from Anilist and transforms it
 */
const fetchAnilistData = async ({
    username,
    isCustomList = false,
}: AnilistParams): Promise<ImportWatchArgs[]> => {
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
                type: 'ANIME',
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

    return transformAnilistData(data, isCustomList);
};

/**
 * Transforms Anilist API response to standard format
 */
const transformAnilistData = (
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
 * React hook for fetching an Anilist user's anime list
 */
export function useAnilist({
    options,
}: {
    options?: Omit<
        Parameters<
            typeof useMutation<ImportWatchArgs[], Error, AnilistParams, unknown>
        >[0],
        'mutationFn'
    >;
} = {}): UseMutationResult<ImportWatchArgs[], Error, AnilistParams, unknown> {
    return useMutation({
        mutationFn: fetchAnilistData,
        ...options,
    });
}
