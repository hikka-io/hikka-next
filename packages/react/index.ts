// Server utilities
export * from './server';

// Provider exports
export * from './provider';

// Core hook utilities
export * from './core/createHikkaClient';
export * from './core/createQueryClient';
export * from './core/queryKeys';
export * from './core/useInfiniteQuery';
export * from './core/useMutation';
export * from './core/useQuery';

// Hooks
export * from './hooks/anime';
export * from './hooks/articles';
export * from './hooks/auth';
export * from './hooks/characters';
export * from './hooks/collections';
export * from './hooks/comments';
export * from './hooks/companies';
export * from './hooks/edit';
export * from './hooks/favourite';
export * from './hooks/follow';
export * from './hooks/genres';
export * from './hooks/history';
export * from './hooks/manga';
export * from './hooks/notifications';
export * from './hooks/novel';
export * from './hooks/people';
export * from './hooks/read';
export * from './hooks/related';
export * from './hooks/schedule';
export * from './hooks/settings';
export * from './hooks/stats';
export * from './hooks/upload';
export * from './hooks/user';
export * from './hooks/vote';
export * from './hooks/watch';

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
