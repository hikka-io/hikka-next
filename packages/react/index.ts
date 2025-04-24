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
export * from './hooks/client';
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

export type { HikkaClientConfig } from '@hikka/client';
export type { QueryClientConfig } from '@tanstack/react-query';

export { dehydrate, HydrationBoundary } from '@tanstack/react-query';
