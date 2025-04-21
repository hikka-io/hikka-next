import { FavouriteContentTypeEnum, FavouriteResponse } from '@hikka/client';
import { FetchQueryOptions, QueryClient } from '@tanstack/query-core';
import { UseQueryOptions } from '@tanstack/react-query';

import { queryKeys } from '../../core/queryKeys';
import { useQuery } from '../../core/useQuery';
import { prefetchQuery } from '../../server/prefetchQuery';

/**
 * Hook for checking favourite status
 */
export function useFavouriteStatus(
    contentType: FavouriteContentTypeEnum,
    slug: string,
    options?: Omit<
        UseQueryOptions<FavouriteResponse, Error, FavouriteResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return useQuery({
        queryKey: queryKeys.favourite.status(contentType, slug),
        queryFn: (client) => client.favourite.get(contentType, slug),
        options: options || {},
    });
}

/**
 * Prefetches favourite status for server-side rendering
 */
export async function prefetchFavouriteStatus(
    queryClient: QueryClient,
    contentType: FavouriteContentTypeEnum,
    slug: string,
    options?: Omit<
        FetchQueryOptions<FavouriteResponse, Error, FavouriteResponse>,
        'queryKey' | 'queryFn'
    >,
) {
    return prefetchQuery({
        queryClient,
        queryKey: queryKeys.favourite.status(contentType, slug),
        queryFn: (client) => client.favourite.get(contentType, slug),
        options,
    });
}
