export interface Response {
    data: {
        MediaListCollection: {
            lists: {
                name:
                    | 'Completed'
                    | 'Planning'
                    | 'Dropped'
                    | 'Paused'
                    | 'Watching'
                    | 'Rewatching';
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

let query = `
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

const getWatchStatus = (
    anilistStatus:
        | 'Completed'
        | 'Planning'
        | 'Dropped'
        | 'Paused'
        | 'Watching'
        | 'Rewatching',
) => {
    switch (anilistStatus) {
        case 'Watching':
            return 'Watching';
        case 'Completed':
            return 'Completed';
        case 'Dropped':
            return 'Dropped';
        case 'Paused':
            return 'On-Hold';
        case 'Planning':
            return 'Plan to Watch';
        case 'Rewatching':
            return 'Rewatching';
    }
};

export default async function req({
    username,
    isCustomList,
}: {
    username: string;
    isCustomList?: boolean;
}): Promise<Record<string, any>[]> {
    const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            query: query,
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

    const reformatted: Record<string, any>[] = [];

    data.data.MediaListCollection.lists.forEach((list) => {
        if (isCustomList ? list.isCustomList : !list.isCustomList) {
            list.entries.forEach((entry) => {
                if (!Number.isInteger(entry.media.idMal)) {
                    return;
                }

                let MALEntry = {
                    series_animedb_id: entry.media.idMal,
                    series_title: entry.media.title.userPreferred,
                    series_type: entry.media.format,
                    series_episodes: entry.media.episodes,
                    my_id: 0,
                    my_watched_episodes: entry.progress,
                    my_start_date: '0000-00-00',
                    my_finish_date: '0000-00-00',
                    my_rated: {},
                    my_score: entry.score >= 1 ? Math.round(entry.score) : 0,
                    my_storage: {},
                    my_storage_value: 0,
                    my_status: isCustomList
                        ? list.name
                        : getWatchStatus(
                              list.name === 'Rewatching'
                                  ? 'Watching'
                                  : list.isCompletedList
                                    ? 'Completed'
                                    : list.name,
                          ),
                    my_comments:
                        entry.notes && entry.notes.length > 0
                            ? String(entry.notes)
                            : {},
                    my_times_watched: entry.repeat,
                    my_rewatch_value: {},
                    my_priority: 'LOW',
                    my_tags: {},
                    my_rewatching: 0,
                    my_rewatching_ep: 0,
                    my_discuss: 1,
                    my_sns: 'default',
                    update_on_import: 0,
                };

                reformatted.push(MALEntry);
            });
        }
    });

    return reformatted;
}
