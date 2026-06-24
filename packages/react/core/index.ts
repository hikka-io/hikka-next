export type { QueryClientConfig } from '@tanstack/react-query';
// TanStack Query exports
export {
    dehydrate,
    HydrationBoundary,
    MutationCache,
    QueryCache,
    QueryClient,
    useQueryClient,
    useSuspenseInfiniteQuery,
    useSuspenseQuery,
} from '@tanstack/react-query';

// Hikka client exports
export * as HikkaClient from '@hikka/client';

export * from './createHikkaClient';
export * from './createQueryClient';
export * from './queryClientHelpers';
export * from './queryKeys';
