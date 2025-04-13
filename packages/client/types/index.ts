import { ReadResponseBase, ReadStatsResponse } from './read';
import {
    IgnoredNotificationsArgs,
    IgnoredNotificationsResponse,
} from './settings';
import { WatchResponseBase } from './watch';

// Export all types by group

// Anime related types
export * from './anime';

// Manga related types
export * from './manga';

// Novel related types
export * from './novel';

// User related types
export * from './user';

// Auth related types
export * from './auth';

// Common types
export * from './common';

// Character related types
export * from './characters';

// People related types
export * from './people';

// Collection related types
export * from './collections';

// Comment related types
export * from './comments';

// Favourite related types
export * from './favourite';

// History related types
export * from './history';

// Article related types
export * from './articles';

// Schedule related types
export * from './schedule';

// Settings related types
export * from './settings';

// Stats related types
export * from './stats';

// Upload related types
export * from './upload';

// Vote related types
export * from './vote';

// Follow related types
export * from './follow';

// Companies related types
// Re-export specific types to avoid naming conflicts
export { CompaniesPaginationResponse, CompaniesSearchArgs } from './companies';

// Related content types
export * from './related';

// Client related types
// Re-export specific types to avoid naming conflicts
export { ClientArgs, ClientCreateResponse } from './client';

// Edit related types
// Re-export with type alias to avoid naming conflicts
export {
    AddEditArgs,
    ContentTypeEnum as EditContentTypeEnum,
    EditPaginationResponse,
    EditResponse,
    EditStatusEnum,
    GetEditListArgs,
    UpdateEditArgs,
} from './edit';

// The following types are defined in multiple modules
// We'll export them from their "primary" module to avoid ambiguity

// Watch related types (primary: watch.ts)
export {
    AnimeWatchSearchArgs,
    UserWatchPaginationResponse,
    WatchArgs,
    WatchPaginationResponse,
    WatchResponse,
    WatchStatsResponse,
    WatchStatusEnum,
} from './watch';

// Read related types (primary: read.ts)
export {
    ReadArgs,
    ReadContentTypeEnum,
    ReadPaginationResponse,
    ReadResponse,
    ReadSearchArgs,
    ReadStatusEnum,
    UserReadPaginationResponse,
} from './read';

// Notification related types (primary: notifications.ts)
export {
    NotificationPaginationResponse,
    NotificationResponse,
    NotificationUnseenResponse,
} from './notifications';

export {
    IgnoredNotificationsArgs,
    IgnoredNotificationsResponse,
    ReadResponseBase,
    ReadStatsResponse,
    WatchResponseBase,
};
