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
    QueryClient,
    useQueryClient,
} from '@tanstack/react-query';

export type { QueryClientConfig } from '@tanstack/react-query';
