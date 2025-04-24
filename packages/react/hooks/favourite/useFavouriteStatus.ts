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
    ...rest
}: UseFavouriteStatusParams & QueryParams<FavouriteResponse>) {
    return useQuery({
        queryKey: queryKeys.favourite.status(contentType, slug),
        queryFn: (client) => client.favourite.get(contentType, slug),
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
        queryFn: (client) => client.favourite.get(contentType, slug),
        ...rest,
    });
}
