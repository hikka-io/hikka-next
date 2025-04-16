import { NovelPaginationResponse, NovelSearchArgs } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UseNovelSearchOptions
    extends Omit<
        UseQueryOptions<
            NovelPaginationResponse,
            Error,
            NovelPaginationResponse,
            ReturnType<typeof queryKeys.novel.search>
        >,
        'queryKey' | 'queryFn'
    > {
    args: NovelSearchArgs;
    page?: number;
    size?: number;
}

/**
 * Hook for searching novels with filters
 */
export function useNovelSearch(params: UseNovelSearchOptions) {
    const { args, page = 1, size = 15, ...queryOptions } = params;

    return useQuery(
        queryKeys.novel.search({ ...args, page, size }),
        (client) => client.novel.search(args, page, size),
        queryOptions,
    );
}

export interface PrefetchNovelSearchParams extends UseNovelSearchOptions {
    queryClient: QueryClient;
}

export async function prefetchNovelSearch(params: PrefetchNovelSearchParams) {
    const { queryClient, args, page = 1, size = 15, ...queryOptions } = params;

    return await prefetchQuery(
        queryClient,
        queryKeys.novel.search({ ...args, page, size }),
        (client) => client.novel.search(args, page, size),
        queryOptions,
    );
}
