// Server utilities
export * from './server';

// Provider exports
export * from './provider';

// Core hook utilities
export * from './core/queryKeys';
export * from './core/useInfiniteQuery';
export * from './core/useMutation';
export * from './core/useQuery';

// Re-export types from the client for convenience
export type {
    AnimeInfoResponse,
    AnimeResponse,
    CharacterResponse,
    CollectionResponse,
    MangaResponse,
    NotificationResponse,
    NovelResponse,
    PersonResponse,
    ReadResponse,
    UserResponse,
    UserWithEmailResponse,
    WatchResponse,
} from '@hikka/client';

// Re-export enums from the client for convenience
export {
    AnimeStatusEnum,
    ContentStatusEnum,
    FavouriteContentTypeEnum,
    ReadStatusEnum,
    WatchStatusEnum,
} from '@hikka/client';
