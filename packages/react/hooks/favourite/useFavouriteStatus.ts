import { FavouriteContentType, FavouriteResponse } from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import { QueryParams, useQuery } from '../../core/useQuery';
import { PrefetchQueryParams, prefetchQuery } from '../../server/prefetchQuery';

export interface UseFavouriteStatusParams {
    contentType: FavouriteContentType;
    slug: string;
}

/**
 * Hook for checking favourite status
 */
export function useFavouriteStatus({
    contentType,
    slug,
    options,
    ...rest
}: UseFavouriteStatusParams & QueryParams<FavouriteResponse>) {
    return useQuery({
        queryKey: queryKeys.favourite.status(contentType, slug),
        queryFn: (client) =>
            client.favourite.getFavouriteStatus(contentType, slug),
        options: {
            authProtected: true,
            ...options,
        },
        ...rest,
    });
}

/**
 * Prefetches favourite status for server-side rendering
 */
export async function prefetchFavouriteStatus({
    contentType,
    slug,
    ...rest
}: PrefetchQueryParams<FavouriteResponse> & UseFavouriteStatusParams) {
    return prefetchQuery({
        queryKey: queryKeys.favourite.status(contentType, slug),
        queryFn: (client) =>
            client.favourite.getFavouriteStatus(contentType, slug),
        ...rest,
    });
}
