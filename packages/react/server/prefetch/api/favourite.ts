import type { FavouriteItem } from '@hikka/client';

import type {
    UseFavouriteListParams,
    UseFavouriteStatusParams,
} from '@/types/favourite';
import {
    favouriteStatusOptions,
    userFavouritesOptions,
} from '@/options/api/favourite';
import {
    type PrefetchInfiniteQueryParams,
    prefetchInfiniteQuery,
} from '@/server/prefetchInfiniteQuery';
import {
    type PrefetchQueryParams,
    prefetchQuery,
} from '@/server/prefetchQuery';

/**
 * Prefetches favourite status for server-side rendering
 */
export async function prefetchFavouriteStatus({
    contentType,
    slug,
    ...rest
}: PrefetchQueryParams & UseFavouriteStatusParams) {
    return prefetchQuery({
        optionsFactory: (client) =>
            favouriteStatusOptions(client, { contentType, slug }),
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
}: PrefetchInfiniteQueryParams & UseFavouriteListParams) {
    return prefetchInfiniteQuery({
        optionsFactory: (client) =>
            userFavouritesOptions<TItem>(client, {
                contentType,
                username,
                paginationArgs,
            }),
        ...rest,
    });
}
