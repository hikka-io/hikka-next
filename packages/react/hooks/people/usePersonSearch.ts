import { PersonSearchPaginationResponse, QuerySearchArgs } from '@hikka/client';
import { QueryClient, UseQueryOptions } from '@tanstack/react-query';

import { prefetchQuery } from '../../server/prefetchQuery';
import { queryKeys } from '../core/queryKeys';
import { useQuery } from '../core/useQuery';

export interface UsePersonSearchOptions
    extends Omit<
        UseQueryOptions<
            PersonSearchPaginationResponse,
            Error,
            PersonSearchPaginationResponse,
            ReturnType<typeof queryKeys.people.search>
        >,
        'queryKey' | 'queryFn'
    > {
    args: QuerySearchArgs;
    page?: number;
    size?: number;
}

/**
 * Hook for searching people
 */
export function usePersonSearch(params: UsePersonSearchOptions) {
    const { args, page = 1, size = 15, ...queryOptions } = params;
    const query = args.query || '';

    return useQuery(
        queryKeys.people.search(query),
        (client) => client.people.search(args, page, size),
        {
            enabled: !!args.query,
            ...queryOptions,
        },
    );
}

export interface PrefetchPersonSearchParams extends UsePersonSearchOptions {
    queryClient: QueryClient;
}

export async function prefetchPersonSearch(params: PrefetchPersonSearchParams) {
    const { queryClient, args, page = 1, size = 15, ...queryOptions } = params;
    const query = args.query || '';

    return await prefetchQuery(
        queryClient,
        queryKeys.people.search(query),
        (client) => client.people.search(args, page, size),
        queryOptions,
    );
}
