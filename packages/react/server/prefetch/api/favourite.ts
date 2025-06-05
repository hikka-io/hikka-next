import {
    FavouriteItem,
    FavouritePaginationResponse,
    FavouriteResponse,
} from '@hikka/client';

import { queryKeys } from '@/core';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import { PrefetchQueryParams, prefetchQuery } from '@/server/prefetchQuery';
import {
    UseFavouriteListParams,
    UseFavouriteStatusParams,
} from '@/types/favourite';

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

/**
 * Prefetches a user's favourite list for server-side rendering
 */
export async function prefetchUserFavourites<TItem extends FavouriteItem>({
    contentType,
    username,
    paginationArgs,
    ...rest
}: PrefetchInfiniteQueryParams<FavouritePaginationResponse<TItem>> &
    UseFavouriteListParams) {
    return prefetchInfiniteQuery({
        queryKey: queryKeys.favourite.list(
            contentType,
            username,
            paginationArgs,
        ),
        queryFn: (client, page = paginationArgs?.page || 1) =>
            client.favourite.getUserFavourites<TItem>(contentType, username, {
                page,
                size: paginationArgs?.size,
            }),
        ...rest,
    });
}
