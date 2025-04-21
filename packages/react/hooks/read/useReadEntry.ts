import { ReadContentTypeEnum, ReadResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving a read entry for manga or novel
 */
export function useReadEntry(
    contentType: ReadContentTypeEnum,
    slug: string,
    options?: Omit<
        UseQueryOptions<ReadResponse, Error, ReadResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.read.entry(contentType, slug),
        queryFn: (client) => client.read.get(contentType, slug),
        options: options || {},
    });
}

/**
 * Prefetches a read entry for server-side rendering
 */
export async function prefetchReadEntry(
    queryClient: QueryClient,
    contentType: ReadContentTypeEnum,
    slug: string,
    options?: Omit<
        FetchQueryOptions<ReadResponse, Error, ReadResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.read.entry(contentType, slug),
        queryFn: (client) => client.read.get(contentType, slug),
        options,
    });
}
