/**
 * Curated enums NOT emitted as named consts by hey-api (the generator inlines
 * them as unions, or namespaces duplicates). The generated enums that DO exist
 * with matching keys (AnimeMediaEnum, WatchStatusEnum, SeasonEnum, …) are
 * re-exported automatically via `export * from './gen'` in index.ts.
 *
 * Each enum is a const object + matching type alias (same shape as the
 * generated `enums: 'javascript'` output), with the exact member keys the app
 * already uses.
 */

/** Canonical content-type superset — assignable to every per-context generated content-type enum. */
export const ContentTypeEnum = {
    CHARACTER: 'character',
    PERSON: 'person',
    ANIME: 'anime',
    MANGA: 'manga',
    NOVEL: 'novel',
    ARTICLE: 'article',
    COLLECTION: 'collection',
    EDIT: 'edit',
    COMMENT: 'comment',
    USER: 'user',
    HISTORY: 'history',
} as const;
export type ContentTypeEnum =
    (typeof ContentTypeEnum)[keyof typeof ContentTypeEnum];

export const ExternalTypeEnum = {
    GENERAL: 'general',
    WATCH: 'watch',
    READ: 'read',
} as const;
export type ExternalTypeEnum =
    (typeof ExternalTypeEnum)[keyof typeof ExternalTypeEnum];

export const GenreTypeEnum = {
    THEME: 'theme',
    EXPLICIT: 'explicit',
    GENRE: 'genre',
    DEMOGRAPHIC: 'demographic',
} as const;
export type GenreTypeEnum = (typeof GenreTypeEnum)[keyof typeof GenreTypeEnum];

export const UserRoleEnum = {
    ADMIN: 'admin',
    MODERATOR: 'moderator',
    USER: 'user',
    BANNED: 'banned',
    NOT_ACTIVATED: 'not_activated',
    DELETED: 'deleted',
} as const;
export type UserRoleEnum = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];

export const NotificationTypeEnum = {
    COMMENT_REPLY: 'comment_reply',
    COMMENT_VOTE: 'comment_vote',
    ARTICLE_VOTE: 'article_vote',
    COMMENT_TAG: 'comment_tag',
    EDIT_COMMENT: 'edit_comment',
    COLLECTION_COMMENT: 'collection_comment',
    ARTICLE_COMMENT: 'article_comment',
    EDIT_ACCEPTED: 'edit_accepted',
    EDIT_DENIED: 'edit_denied',
    EDIT_UPDATED: 'edit_updated',
    HIKKA_UPDATE: 'hikka_update',
    SCHEDULE_ANIME: 'schedule_anime',
    FOLLOW: 'follow',
    COLLECTION_VOTE: 'collection_vote',
    THIRDPARTY_LOGIN: 'thirdparty_login',
} as const;
export type NotificationTypeEnum =
    (typeof NotificationTypeEnum)[keyof typeof NotificationTypeEnum];

export const HistoryTypeEnum = {
    WATCH: 'watch',
    WATCH_DELETE: 'watch_delete',
    READ_NOVEL: 'read_novel',
    READ_NOVEL_DELETE: 'read_novel_delete',
    READ_MANGA: 'read_manga',
    READ_MANGA_DELETE: 'read_manga_delete',
    WATCH_IMPORT: 'watch_import',
    READ_IMPORT: 'read_import',
    FAVOURITE_ANIME_ADD: 'favourite_anime_add',
    FAVOURITE_ANIME_REMOVE: 'favourite_anime_remove',
    FAVOURITE_MANGA_ADD: 'favourite_manga_add',
    FAVOURITE_MANGA_REMOVE: 'favourite_manga_remove',
    FAVOURITE_NOVEL_ADD: 'favourite_novel_add',
    FAVOURITE_NOVEL_REMOVE: 'favourite_novel_remove',
} as const;
export type HistoryTypeEnum =
    (typeof HistoryTypeEnum)[keyof typeof HistoryTypeEnum];

export const AnimeVideoTypeEnum = {
    VIDEO_PROMO: 'video_promo',
    VIDEO_MUSIC: 'video_music',
} as const;
export type AnimeVideoTypeEnum =
    (typeof AnimeVideoTypeEnum)[keyof typeof AnimeVideoTypeEnum];

export const AnimeOSTTypeEnum = {
    OPENING: 'opening',
    ENDING: 'ending',
} as const;
export type AnimeOSTTypeEnum =
    (typeof AnimeOSTTypeEnum)[keyof typeof AnimeOSTTypeEnum];

export const HomeWidgetsEnum = {
    LIST: 'list',
    PROFILE: 'profile',
    FEED: 'feed',
    TRACKER: 'tracker',
    HISTORY: 'history',
    ONGOINGS: 'ongoings',
    SCHEDULE: 'schedule',
} as const;
export type HomeWidgetsEnum =
    (typeof HomeWidgetsEnum)[keyof typeof HomeWidgetsEnum];
