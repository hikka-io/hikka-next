import {
    FavouriteContentType,
    FavouriteItem,
    FavouritePaginationResponse,
} from '@hikka/client';

import { queryKeys } from '../../core/queryKeys';
import {
    InfiniteQueryParams,
    useInfiniteQuery,
} from '../../core/useInfiniteQuery';
import {
    PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '../../server/prefetchInfiniteQuery';

export interface UseFavouriteListParams {
    contentType: FavouriteContentType;
    username: string;
}

/**
 * Hook for retrieving a user's favourite list
 */
export function useUserFavourites<TItem extends FavouriteItem>({
    contentType,
    username,
    paginationArgs,
    ...rest
}: UseFavouriteListParams &
    InfiniteQueryParams<FavouritePaginationResponse<TItem>>) {
    return useInfiniteQuery({
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
