import { ReadContentType, ReadResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseReadEntryParams {
    contentType: ReadContentType;
    slug: string;
}

/**
 * Hook for retrieving a read entry for manga or novel
 */
export function useReadBySlug({
    contentType,
    slug,
    options,
    ...rest
}: UseReadEntryParams & QueryParams<ReadResponse>) {
    return useQuery({
        queryKey: queryKeys.read.entry(contentType, slug),
        queryFn: (client) => client.read.getReadBySlug(contentType, slug),
        options: {
            authProtected: true,
            ...options,
        },
        ...rest,
    });
}

/**
 * Prefetches a read entry for server-side rendering
 */
export async function prefetchReadBySlug({
    contentType,
    slug,
    ...rest
}: PrefetchQueryParams<ReadResponse> & UseReadEntryParams) {
    return prefetchQuery({
        queryKey: queryKeys.read.entry(contentType, slug),
        queryFn: (client) => client.read.getReadBySlug(contentType, slug),
        ...rest,
    });
}
