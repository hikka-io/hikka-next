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
    page?: number;
    size?: number;
}

/**
 * Hook for searching novels with filters
 */
export function useNovelSearch(
    args: NovelSearchArgs,
    options: UseNovelSearchOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return useQuery(
        queryKeys.novel.search({ ...args, page, size }),
        (client) => client.novel.search(args, page, size),
        queryOptions,
    );
}

export async function prefetchNovelSearch(
    queryClient: QueryClient,
    args: NovelSearchArgs,
    options: UseNovelSearchOptions = {},
) {
    const { page = 1, size = 15, ...queryOptions } = options;

    return await prefetchQuery(
        queryClient,
        queryKeys.novel.search({ ...args, page, size }),
        (client) => client.novel.search(args, page, size),
        queryOptions,
    );
}
