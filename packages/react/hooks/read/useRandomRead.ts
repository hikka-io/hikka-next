import {
    MangaResponse,
    NovelResponse,
    ReadContentTypeEnum,
    ReadStatusEnum,
} from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for retrieving a random manga/novel from a user's read list
 */
export function useRandomRead<T extends MangaResponse | NovelResponse>(
    contentType: ReadContentTypeEnum,
    username: string,
    status: ReadStatusEnum,
    options?: Omit<UseQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>,
) {
    return useQuery({
        queryKey: queryKeys.read.random(contentType, username, status),
        queryFn: (client) =>
            client.read.getRandom(contentType, username, status) as Promise<T>,
        options: options || {},
    });
}

/**
 * Prefetches a random manga/novel from a user's read list for server-side rendering
 */
export async function prefetchRandomRead<
    T extends MangaResponse | NovelResponse,
>(
    queryClient: QueryClient,
    contentType: ReadContentTypeEnum,
    username: string,
    status: ReadStatusEnum,
    options?: Omit<FetchQueryOptions<T, Error, T>, 'queryKey' | 'queryFn'>,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.read.random(contentType, username, status),
        queryFn: (client) =>
            client.read.getRandom(contentType, username, status) as Promise<T>,
        options,
    });
}
