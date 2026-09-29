export const AnilistTypeEnum = {
    ANIME: 'ANIME',
    MANGA: 'MANGA',
} as const;

export type AnilistTypeEnum =
    (typeof AnilistTypeEnum)[keyof typeof AnilistTypeEnum];

export const AnilistStatusEnum = {
    CURRENT: 'Current',
    REPEATING: 'Repeating',
    COMPLETED: 'Completed',
    PLANNING: 'Planning',
    DROPPED: 'Dropped',
    PAUSED: 'Paused',
    WATCHING: 'Watching',
    REWATCHING: 'Rewatching',
} as const;

export type AnilistStatusEnum =
    (typeof AnilistStatusEnum)[keyof typeof AnilistStatusEnum];
