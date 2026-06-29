/**
 * Hand-maintained enums for the few response fields the backend still serialises
 * as a bare `string` (no `enum`/`const` in the OpenAPI spec), so hey-api has
 * nothing to generate from:
 *   - GenreTypeEnum — GenreResponse.type
 *   - UserRoleEnum  — UserResponse.role
 * plus two app-level conveniences with no single backend equivalent:
 *   - ContentTypeEnum     — canonical superset over the per-context content
 *                           types the spec splits apart. The backend's own
 *                           generated `ContentTypeEnum` is only
 *                           collection|comment|article, so index.ts re-exports
 *                           this one explicitly to shadow it.
 *   - MainContentTypeEnum — anime|manga|novel narrowing.
 *
 * Everything the backend declares natively (NotificationTypeEnum, HistoryTypeEnum,
 * ExternalTypeEnum, AnimeOstTypeEnum, AnimeVideoTypeEnum, UiWidgetEnum, …) is
 * generated and re-exported via `export * from './gen'` in index.ts — keep those
 * out of here. Delete GenreTypeEnum/UserRoleEnum once those fields are typed with
 * their real enums upstream.
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

/**
 * The three "main" media content types (anime/manga/novel). A narrowing of
 * ContentTypeEnum for the catalog/detail surfaces that only ever deal with
 * media titles — use this instead of a raw `'anime' | 'manga' | 'novel'` union.
 */
export const MainContentTypeEnum = {
    ANIME: 'anime',
    MANGA: 'manga',
    NOVEL: 'novel',
} as const;
export type MainContentTypeEnum =
    (typeof MainContentTypeEnum)[keyof typeof MainContentTypeEnum];

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
