export * from './createHikkaClient';
export * from './createQueryClient';
export * from './queryKeys';

// Hikka client exports
export * as HikkaClient from '@hikka/client';

// TanStack Query exports
export {
    dehydrate,
    HydrationBoundary,
    MutationCache,
    QueryCache,
} from '@tanstack/react-query';

export type { QueryClient, QueryClientConfig } from '@tanstack/react-query';
